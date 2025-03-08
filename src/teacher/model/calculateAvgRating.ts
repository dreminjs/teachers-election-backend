export const calculateAverageRating = (grades: number[]) => {
    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return grades.length ? total / grades.length : 0;
  };
