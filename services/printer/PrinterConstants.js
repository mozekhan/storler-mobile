export const PAPER_WIDTH = {
  MM58: 32,
  MM80: 48,
};

export const ALIGN = {
  LEFT: 0,
  CENTER: 1,
  RIGHT: 2,
};

export const FONT = {
  A: 0,
  B: 1,
};

export const PRINTER_STATUS = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  PRINTING: "PRINTING",
  ERROR: "ERROR",
};

export const DEFAULT_SETTINGS = {
  paperWidth: PAPER_WIDTH.MM58,
  copies: 1,
  printLogo: true,
  printQRCode: true,
  autoConnect: true,
  feedLines: 3,
};