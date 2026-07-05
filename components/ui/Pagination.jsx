import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const totalVisible = siblingCount * 2 + 3; // siblings + current + first + last

    if (totalPages <= totalVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    let startPage = Math.max(2, currentPage - siblingCount);
    let endPage = Math.min(totalPages - 1, currentPage + siblingCount);

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={20} color={currentPage === 1 ? Colors.gray300 : Colors.gray700} />
      </TouchableOpacity>

      {showPageNumbers && visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <Text style={styles.ellipsis}>...</Text>
          ) : (
            <TouchableOpacity
              style={[styles.pageButton, currentPage === page && styles.pageButtonActive]}
              onPress={() => onPageChange(page)}
            >
              <Text style={[styles.pageText, currentPage === page && styles.pageTextActive]}>
                {page}
              </Text>
            </TouchableOpacity>
          )}
        </React.Fragment>
      ))}

      <TouchableOpacity
        style={[styles.button, currentPage === totalPages && styles.buttonDisabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} color={currentPage === totalPages ? Colors.gray300 : Colors.gray700} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginHorizontal: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginHorizontal: 2,
    paddingHorizontal: Spacing.sm,
  },
  pageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageText: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  pageTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  ellipsis: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    paddingHorizontal: Spacing.xs,
  },
});

export default Pagination;