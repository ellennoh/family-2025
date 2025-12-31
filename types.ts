
export enum CategoryType {
  PHOTOBOOK = "Family Photobook",
  SOUNDTRACK = "The Soundtrack",
  KEYWORDS = "Keywords of 2025",
  MVP = "MVP of 2025",
  WIN = "Biggest Win",
  MEAL = "Best Meal",
  PURCHASE = "Best Purchase",
  GOAL = "2026 Goal"
}

export interface Memory {
  id: string;
  category: CategoryType;
  content: string;
  author: string;
  timestamp: number;
  imageUrl?: string;
}

export interface AIReviewResult {
  summary: string;
  keywords: string[];
  suggestedPlaylist: {
    title: string;
    description: string;
  };
}
