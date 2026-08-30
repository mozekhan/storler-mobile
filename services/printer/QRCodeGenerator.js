// // services/printer/QRCodeGenerator.js
// /**
//  * QRCodeGenerator
//  *
//  * Renders a QR code as a 1-bit PNG bitmap, entirely in JavaScript.
//  *
//  * WHY THIS EXISTS:
//  * Native "print QR code" commands (ESC/POS `GS ( k`) are implemented
//  * inconsistently across cheap/clone thermal printers and across the
//  * various React Native printer libraries that wrap them. When a
//  * printer/library doesn't support the exact QR command variant being
//  * sent, it commonly falls back to dumping the raw payload as plain
//  * text instead of a scannable code - which is exactly the "prints
//  * large text instead of a QR code" symptom this module fixes.
//  *
//  * The fix is to stop depending on any vendor-specific native QR
//  * command and instead print the QR code as a raster image, using
//  * printImage()/`GS v 0`, which is the one graphics command virtually
//  * every ESC/POS-compatible printer (and every printer library)
//  * implements correctly, regardless of brand.
//  *
//  * This module has ZERO native dependencies:
//  * - QR matrix + error correction: `qrcode-generator` (pure JS, no DOM/canvas)
//  * - PNG encoding: hand-rolled, using uncompressed ("stored") DEFLATE
//  *   blocks, which are fully valid per the zlib/PNG spec and require no
//  *   compression library.
//  * - Base64 encoding: hand-rolled (RN/Hermes has no global Buffer).
//  *
//  * Requires: `npm install qrcode-generator`
//  */

// import qrcodegen from 'qrcode-generator';

// // ============================================================
// // UTF-8 -> "binary string" (1 char == 1 byte)
// // ============================================================
// // qrcode-generator's byte-mode encoder reads a JS string one
// // char code at a time and treats each as a single byte. Feeding
// // it a pre-encoded UTF-8 "binary string" (instead of a native JS
// // string) lets multi-byte characters (e.g. currency symbols) survive
// // round-trip without needing to touch the library's internals.

// function utf8BinaryString(str) {
//   let out = '';

//   for (let i = 0; i < str.length; i++) {
//     let code = str.codePointAt(i);

//     if (code > 0xffff) {
//       // Surrogate pair consumed two UTF-16 code units.
//       i++;
//     }

//     if (code <= 0x7f) {
//       out += String.fromCharCode(code);
//     } else if (code <= 0x7ff) {
//       out += String.fromCharCode(0xc0 | (code >> 6));
//       out += String.fromCharCode(0x80 | (code & 0x3f));
//     } else if (code <= 0xffff) {
//       out += String.fromCharCode(0xe0 | (code >> 12));
//       out += String.fromCharCode(0x80 | ((code >> 6) & 0x3f));
//       out += String.fromCharCode(0x80 | (code & 0x3f));
//     } else {
//       out += String.fromCharCode(0xf0 | (code >> 18));
//       out += String.fromCharCode(0x80 | ((code >> 12) & 0x3f));
//       out += String.fromCharCode(0x80 | ((code >> 6) & 0x3f));
//       out += String.fromCharCode(0x80 | (code & 0x3f));
//     }
//   }

//   return out;
// }

// // ============================================================
// // CRC32 (PNG chunk checksums) + Adler32 (zlib stream checksum)
// // ============================================================

// let crcTable = null;

// function crc32(bytes) {
//   if (!crcTable) {
//     crcTable = new Uint32Array(256);

//     for (let n = 0; n < 256; n++) {
//       let c = n;

//       for (let k = 0; k < 8; k++) {
//         c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
//       }

//       crcTable[n] = c >>> 0;
//     }
//   }

//   let crc = 0xffffffff;

//   for (let i = 0; i < bytes.length; i++) {
//     crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
//   }

//   return (crc ^ 0xffffffff) >>> 0;
// }

// function adler32(bytes) {
//   const MOD_ADLER = 65521;
//   let a = 1;
//   let b = 0;

//   for (let i = 0; i < bytes.length; i++) {
//     a = (a + bytes[i]) % MOD_ADLER;
//     b = (b + a) % MOD_ADLER;
//   }

//   return ((b << 16) | a) >>> 0;
// }

// function u32be(n) {
//   return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
// }

// // ============================================================
// // Minimal, spec-valid PNG encoder (1-bit grayscale, uncompressed)
// // ============================================================

// function buildChunk(type, dataArr) {
//   const typeBytes = Array.from(type).map(c => c.charCodeAt(0));
//   const body = typeBytes.concat(dataArr);
//   const crc = crc32(Uint8Array.from(body));

//   return [].concat(u32be(dataArr.length), typeBytes, dataArr, u32be(crc));
// }

// /**
//  * Wraps raw bytes in a valid zlib stream made of uncompressed
//  * ("stored") DEFLATE blocks. This is a legal DEFLATE encoding
//  * (RFC 1951 ยง3.2.4) - it just skips Huffman compression, which is
//  * unnecessary for a small 1-bit QR bitmap and avoids needing a full
//  * compressor implementation.
//  */
// function deflateStoreZlib(bytes) {
//   const out = [0x78, 0x01]; // zlib header: deflate, 32K window, fastest
//   const len = bytes.length;
//   let offset = 0;

//   if (len === 0) {
//     out.push(1, 0, 0, 0xff, 0xff);
//   }

//   while (offset < len) {
//     const remain = len - offset;
//     const blockLen = Math.min(remain, 65535);
//     const isFinal = offset + blockLen >= len ? 1 : 0;

//     out.push(isFinal);
//     out.push(blockLen & 0xff, (blockLen >> 8) & 0xff);

//     const nlen = ~blockLen & 0xffff;
//     out.push(nlen & 0xff, (nlen >> 8) & 0xff);

//     for (let i = 0; i < blockLen; i++) {
//       out.push(bytes[offset + i]);
//     }

//     offset += blockLen;
//   }

//   out.push(...u32be(adler32(Uint8Array.from(bytes))));

//   return out;
// }

// /**
//  * Encodes a 1-bit-per-pixel grayscale PNG.
//  * isDark(x, y) => true for a black pixel, false for white.
//  */
// function encodePNG1Bit(width, height, isDark) {
//   const rowBytes = Math.ceil(width / 8);
//   const raw = [];

//   for (let y = 0; y < height; y++) {
//     raw.push(0); // scanline filter type: None

//     const row = new Uint8Array(rowBytes);

//     for (let x = 0; x < width; x++) {
//       // PNG grayscale bit depth 1: sample 0 = black, 1 = white.
//       // The row buffer starts zeroed (all black); flip bits white.
//       if (!isDark(x, y)) {
//         row[x >> 3] |= 0x80 >> (x & 7);
//       }
//     }

//     for (let i = 0; i < rowBytes; i++) {
//       raw.push(row[i]);
//     }
//   }

//   const ihdr = [].concat(
//     u32be(width),
//     u32be(height),
//     [1, 0, 0, 0, 0], // bit depth 1, color type 0 (grayscale), deflate, filter 0, no interlace
//   );

//   const idatData = deflateStoreZlib(raw);
//   const signature = [137, 80, 78, 71, 13, 10, 26, 10];

//   const bytes = []
//     .concat(signature)
//     .concat(buildChunk('IHDR', ihdr))
//     .concat(buildChunk('IDAT', idatData))
//     .concat(buildChunk('IEND', []));

//   return Uint8Array.from(bytes);
// }

// // ============================================================
// // Base64 (no Buffer dependency - Hermes/RN doesn't provide one globally)
// // ============================================================

// const BASE64_CHARS =
//   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// function bytesToBase64(bytes) {
//   let result = '';
//   const len = bytes.length;

//   for (let i = 0; i < len; i += 3) {
//     const b0 = bytes[i];
//     const b1 = i + 1 < len ? bytes[i + 1] : 0;
//     const b2 = i + 2 < len ? bytes[i + 2] : 0;
//     const triple = (b0 << 16) | (b1 << 8) | b2;

//     result += BASE64_CHARS[(triple >> 18) & 0x3f];
//     result += BASE64_CHARS[(triple >> 12) & 0x3f];
//     result += i + 1 < len ? BASE64_CHARS[(triple >> 6) & 0x3f] : '=';
//     result += i + 2 < len ? BASE64_CHARS[triple & 0x3f] : '=';
//   }

//   return result;
// }

// // ============================================================
// // PUBLIC API
// // ============================================================

// /**
//  * Generates a QR code as a base64 PNG suitable for printImage().
//  *
//  * @param {string} text - Data to encode (URL, reference, etc).
//  * @param {object} options
//  * @param {'L'|'M'|'Q'|'H'} [options.errorCorrectionLevel='M']
//  * @param {number} [options.moduleScale=4] - Preferred print dots per QR
//  *   module. At ~203dpi (standard thermal head resolution, ~8 dots/mm),
//  *   a scale of 4 gives a ~0.5mm module.
//  * @param {number} [options.minModuleScale=3] - Never shrink below this
//  *   many dots/module to fit maxWidthPx. Small modules are the first
//  *   thing to break under any real-world print degradation (head wear,
//  *   low contrast, and especially any resize/dither a printer library
//  *   applies internally when it receives an image) - it's better to
//  *   run wider than requested (see fullWidthPx) than to shrink past
//  *   this and produce something that looks like a QR code but doesn't
//  *   reliably scan.
//  * @param {number} [options.quietZoneModules=4] - White border width in
//  *   modules. The QR spec requires >= 4 modules of quiet zone around
//  *   the code for reliable decoding.
//  * @param {number|null} [options.maxWidthPx=null] - Preferred max image
//  *   width in dots (typically paper width with a safety margin).
//  * @param {number|null} [options.fullWidthPx=null] - Absolute max width
//  *   in dots (typically the printer's full printable width, no margin).
//  *   If honoring minModuleScale would exceed maxWidthPx, the code is
//  *   allowed to grow up to fullWidthPx before minModuleScale is ever
//  *   reduced. Defaults to maxWidthPx if not given.
//  *
//  * @returns {{ base64: string, widthPx: number, heightPx: number,
//  *   moduleCount: number, scale: number } | null} null if text is empty.
//  */
// function generateQRCodeImage(text, options = {}) {
//   const {
//     errorCorrectionLevel = 'M',
//     moduleScale = 4,
//     minModuleScale = 3,
//     quietZoneModules = 4,
//     maxWidthPx = null,
//     fullWidthPx = null,
//   } = options;

//   const data = String(text ?? '').trim();

//   if (!data) {
//     return null;
//   }

//   const qr = qrcodegen(0, errorCorrectionLevel); // typeNumber 0 = auto-select smallest version
//   qr.addData(utf8BinaryString(data));
//   qr.make();

//   const moduleCount = qr.getModuleCount();
//   const totalModules = moduleCount + quietZoneModules * 2;

//   let scale = Math.max(1, Math.round(moduleScale));
//   const floor = Math.max(1, Math.round(minModuleScale));
//   const absoluteMaxWidthPx = fullWidthPx || maxWidthPx;

//   if (maxWidthPx) {
//     const preferredMaxScale = Math.floor(maxWidthPx / totalModules);

//     if (preferredMaxScale >= 1) {
//       scale = Math.min(scale, preferredMaxScale);
//     }

//     // Fitting within the preferred width would push us below the
//     // scannability floor - try the fuller width allowance first
//     // rather than shrinking further.
//     if (scale < floor && absoluteMaxWidthPx) {
//       const fullScale = Math.floor(absoluteMaxWidthPx / totalModules);

//       if (fullScale >= floor) {
//         scale = floor;
//       } else if (fullScale >= 1) {
//         scale = fullScale;
//       }
//     }

//     if (scale < floor) {
//       console.warn(
//         '[QRCodeGenerator] Payload requires modules smaller than the ' +
//           `configured minimum (wanted >= ${floor} dots/module, only ` +
//           `${scale} fits available width) - printed code may not scan ` +
//           'reliably. Consider a shorter payload or lower error ' +
//           'correction level.',
//       );
//     }

//     scale = Math.max(scale, 1);
//   }

//   const widthPx = totalModules * scale;
//   const heightPx = widthPx;

//   const isDark = (x, y) => {
//     const moduleX = Math.floor(x / scale) - quietZoneModules;
//     const moduleY = Math.floor(y / scale) - quietZoneModules;

//     if (
//       moduleX < 0 ||
//       moduleY < 0 ||
//       moduleX >= moduleCount ||
//       moduleY >= moduleCount
//     ) {
//       return false; // quiet zone: white
//     }

//     return qr.isDark(moduleY, moduleX);
//   };

//   const pngBytes = encodePNG1Bit(widthPx, heightPx, isDark);
//   const base64 = bytesToBase64(pngBytes);

//   return {
//     base64,
//     widthPx,
//     heightPx,
//     moduleCount,
//     scale,
//   };
// }

// export default { generateQRCodeImage };
// export { generateQRCodeImage };



































// services/printer/QRCodeGenerator.js
import qrcodegen from 'qrcode-generator';

function utf8BinaryString(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    let code = str.codePointAt(i);
    if (code > 0xffff) i++;
    if (code <= 0x7f) {
      out += String.fromCharCode(code);
    } else if (code <= 0x7ff) {
      out += String.fromCharCode(0xc0 | (code >> 6));
      out += String.fromCharCode(0x80 | (code & 0x3f));
    } else if (code <= 0xffff) {
      out += String.fromCharCode(0xe0 | (code >> 12));
      out += String.fromCharCode(0x80 | ((code >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (code & 0x3f));
    } else {
      out += String.fromCharCode(0xf0 | (code >> 18));
      out += String.fromCharCode(0x80 | ((code >> 12) & 0x3f));
      out += String.fromCharCode(0x80 | ((code >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (code & 0x3f));
    }
  }
  return out;
}

let crcTable = null;

function crc32(bytes) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function adler32(bytes) {
  const MOD_ADLER = 65521;
  let a = 1;
  let b = 0;
  for (let i = 0; i < bytes.length; i++) {
    a = (a + bytes[i]) % MOD_ADLER;
    b = (b + a) % MOD_ADLER;
  }
  return ((b << 16) | a) >>> 0;
}

function u32be(n) {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function buildChunk(type, dataArr) {
  const typeBytes = Array.from(type).map(c => c.charCodeAt(0));
  const body = typeBytes.concat(dataArr);
  const crc = crc32(Uint8Array.from(body));
  return [].concat(u32be(dataArr.length), typeBytes, dataArr, u32be(crc));
}

function deflateStoreZlib(bytes) {
  const out = [0x78, 0x01];
  const len = bytes.length;
  let offset = 0;
  if (len === 0) {
    out.push(1, 0, 0, 0xff, 0xff);
  }
  while (offset < len) {
    const remain = len - offset;
    const blockLen = Math.min(remain, 65535);
    const isFinal = offset + blockLen >= len ? 1 : 0;
    out.push(isFinal);
    out.push(blockLen & 0xff, (blockLen >> 8) & 0xff);
    const nlen = ~blockLen & 0xffff;
    out.push(nlen & 0xff, (nlen >> 8) & 0xff);
    for (let i = 0; i < blockLen; i++) {
      out.push(bytes[offset + i]);
    }
    offset += blockLen;
  }
  out.push(...u32be(adler32(Uint8Array.from(bytes))));
  return out;
}

function encodePNG1Bit(width, height, isDark) {
  const rowBytes = Math.ceil(width / 8);
  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0);
    const row = new Uint8Array(rowBytes);
    for (let x = 0; x < width; x++) {
      if (!isDark(x, y)) {
        row[x >> 3] |= 0x80 >> (x & 7);
      }
    }
    for (let i = 0; i < rowBytes; i++) {
      raw.push(row[i]);
    }
  }
  const ihdr = [].concat(u32be(width), u32be(height), [1, 0, 0, 0, 0]);
  const idatData = deflateStoreZlib(raw);
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  const bytes = []
    .concat(signature)
    .concat(buildChunk('IHDR', ihdr))
    .concat(buildChunk('IDAT', idatData))
    .concat(buildChunk('IEND', []));
  return Uint8Array.from(bytes);
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes) {
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < len ? bytes[i + 1] : 0;
    const b2 = i + 2 < len ? bytes[i + 2] : 0;
    const triple = (b0 << 16) | (b1 << 8) | b2;
    result += BASE64_CHARS[(triple >> 18) & 0x3f];
    result += BASE64_CHARS[(triple >> 12) & 0x3f];
    result += i + 1 < len ? BASE64_CHARS[(triple >> 6) & 0x3f] : '=';
    result += i + 2 < len ? BASE64_CHARS[triple & 0x3f] : '=';
  }
  return result;
}

/**
 * Generates a QR code as a base64 PNG.
 * 
 * CRITICAL FIX for 58mm paper:
 * - Minimum module scale is 4 (was 5) to fit on 58mm paper
 * - Error correction is 'M' (was 'H') to reduce module count
 * - If payload is too large, it will warn but still generate
 */
function generateQRCodeImage(text, options = {}) {
  const {
    errorCorrectionLevel = 'M',  // 'M' is sufficient and creates smaller QR codes
    moduleScale = 5,             // Default scale
    minModuleScale = 4,          // CRITICAL FIX: 4 dots/module minimum for 58mm
    quietZoneModules = 4,
    maxWidthPx = null,
    fullWidthPx = null,
  } = options;

  const data = String(text ?? '').trim();

  if (!data) {
    return null;
  }

  // If data is a data URL, fail fast
  if (data.startsWith('data:image/')) {
    console.error('[QRCodeGenerator] Cannot encode data URL as QR content.');
    return null;
  }

  console.log('[QRCodeGenerator] Encoding QR data:', {
    length: data.length,
    preview: data.substring(0, 100),
  });

  // Use QR code generator
  const qr = qrcodegen(0, errorCorrectionLevel);
  qr.addData(utf8BinaryString(data));
  qr.make();

  const moduleCount = qr.getModuleCount();
  const totalModules = moduleCount + quietZoneModules * 2;

  // Calculate scale based on available width
  let scale = Math.max(1, Math.round(moduleScale));
  const floor = Math.max(1, Math.round(minModuleScale));

  if (maxWidthPx) {
    const preferredMaxScale = Math.floor(maxWidthPx / totalModules);
    if (preferredMaxScale >= 1) {
      scale = Math.min(scale, preferredMaxScale);
    }
    // If we'd go below the minimum, use the minimum
    if (scale < floor) {
      scale = floor;
    }
  }

  // CRITICAL FIX: For 58mm paper, ensure we don't use too many modules
  // If the QR code would exceed the paper width at minimum scale, 
  // reduce the error correction level and try again
  if (scale < 4 && errorCorrectionLevel !== 'L') {
    console.warn(
      '[QRCodeGenerator] QR code would be too small at ' + scale + 
      ' dots/module. Trying with L error correction...'
    );
    // Try again with L error correction
    const qrL = qrcodegen(0, 'L');
    qrL.addData(utf8BinaryString(data));
    qrL.make();
    const moduleCountL = qrL.getModuleCount();
    const totalModulesL = moduleCountL + quietZoneModules * 2;
    const scaleL = Math.floor(maxWidthPx / totalModulesL);
    if (scaleL >= 4) {
      // Use the L version
      const widthPx = totalModulesL * scaleL;
      const heightPx = widthPx;
      const isDarkL = (x, y) => {
        const moduleX = Math.floor(x / scaleL) - quietZoneModules;
        const moduleY = Math.floor(y / scaleL) - quietZoneModules;
        if (moduleX < 0 || moduleY < 0 || moduleX >= moduleCountL || moduleY >= moduleCountL) {
          return false;
        }
        return qrL.isDark(moduleY, moduleX);
      };
      const pngBytes = encodePNG1Bit(widthPx, heightPx, isDarkL);
      const base64 = bytesToBase64(pngBytes);
      return {
        base64,
        widthPx,
        heightPx,
        moduleCount: moduleCountL,
        scale: scaleL,
      };
    }
  }

  // If still too small, warn but continue
  if (scale < 4) {
    console.warn(
      '[QRCodeGenerator] QR code printed at only ' + scale + 
      ' dots/module. This may not scan reliably on 58mm paper. ' +
      'Consider reducing payload size.'
    );
  }

  const widthPx = totalModules * scale;
  const heightPx = widthPx;

  const isDark = (x, y) => {
    const moduleX = Math.floor(x / scale) - quietZoneModules;
    const moduleY = Math.floor(y / scale) - quietZoneModules;
    if (moduleX < 0 || moduleY < 0 || moduleX >= moduleCount || moduleY >= moduleCount) {
      return false;
    }
    return qr.isDark(moduleY, moduleX);
  };

  const pngBytes = encodePNG1Bit(widthPx, heightPx, isDark);
  const base64 = bytesToBase64(pngBytes);

  console.log('[QRCodeGenerator] Generated QR:', {
    moduleCount,
    scale,
    widthPx,
    heightPx,
  });

  return {
    base64,
    widthPx,
    heightPx,
    moduleCount,
    scale,
  };
}

export default { generateQRCodeImage };
export { generateQRCodeImage };