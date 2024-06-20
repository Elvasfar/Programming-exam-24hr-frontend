// src/utils/translateGender.ts
export function translateGender(gender: string): string {
    switch (gender) {
      case 'Male':
        return 'Mand';
      case 'Female':
        return 'Kvinde';
      default:
        return gender; // If the gender is not recognized, return it as is
    }
  }
  