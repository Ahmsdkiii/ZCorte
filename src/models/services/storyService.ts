import { apiRequest, isApiConfigured } from "../api/httpClient";
import {
  mockApextiveStorySteps,
  mockOutdoorStorySteps,
  mockStorySteps,
  mockTactixStorySteps,
} from "../data/stories.mock";
import { mapStoryStepDtoToDomain, StoryStepDto } from "../mappers/product.mapper";
import { ProductCollection } from "../types/product";
import { StoryStep } from "../types/story";

export type StoryCollectionKey = "home" | ProductCollection;

const STORY_MAP: Record<StoryCollectionKey, StoryStep[]> = {
  home: mockStorySteps,
  tactix: mockTactixStorySteps,
  apextive: mockApextiveStorySteps,
  outdoor: mockOutdoorStorySteps,
};

export async function getStorySteps(collection: StoryCollectionKey = "home"): Promise<StoryStep[]> {
  if (isApiConfigured()) {
    try {
      const dtos = await apiRequest<StoryStepDto[]>(`/stories/${encodeURIComponent(collection)}`);
      return dtos.map((dto, idx) => mapStoryStepDtoToDomain(dto, idx));
    } catch {
      return STORY_MAP[collection] ?? mockStorySteps;
    }
  }

  return STORY_MAP[collection] ?? mockStorySteps;
}
