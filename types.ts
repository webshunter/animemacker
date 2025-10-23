export interface SceneOutput {
  title: string;
  image_prompt: string;
  video_prompt: string;
}

export interface Character {
  name: string;
  description: string;
  image: string; // base64 encoded image
}

export interface Creation extends SceneOutput {
  id: string;
  generatedImage: string;
  image_filename?: string;
}
