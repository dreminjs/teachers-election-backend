export const calculateAverageRating = (reviews: { grade: number }[]) => {
    const total = reviews.reduce((sum, review) => sum + review.grade, 0);
    return reviews.length ? total / reviews.length : 0;
  };
