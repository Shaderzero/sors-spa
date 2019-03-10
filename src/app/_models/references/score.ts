export class Score {
  probability: number;
  health: number;
  environment: number;
  reputation: number;
  financial: number;
  expert: string;
  expertComment: string;
  score: number;

  constructor() {
    this.probability = 0;
    this.health = 0;
    this.environment = 0;
    this.reputation = 0;
    this.financial = 0;
    this.expert = '';
    this.expertComment = '';
  }

  getOverall() {
    const summ = this.toRating(this.health) +
      this.toRating(this.environment) +
      this.toRating(this.reputation) +
      this.toRating(this.financial);
    if (summ < 4) {
      return 1;
    } else if (summ < 16) {
      return 2;
    } else if (summ < 32) {
      return 3;
    } else if (summ < 64) {
      return 4;
    } else {
      return 5;
    }
  }

  getLevel() {
    return this.probability + this.getOverall();
  }

  getSignificance() {
    const level = this.getLevel();
    if (level < 5) {
      return 'несущественный';
    } else if (level < 8) {
      return 'существенный';
    } else {
      return 'критический';
    }
  }

  toRating(score: number) {
    switch (score) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 4;
      case 3:
        return 16;
      case 4:
        return 32;
      case 5:
        return 64;
    }
  }

}
