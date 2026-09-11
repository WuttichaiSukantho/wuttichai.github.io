export class ContentEntity {
  readonly image: string;
  readonly alt: string;
  readonly text: string;

  constructor(image: string, alt: string, text: string) {
    this.image = image;
    this.alt = alt;
    this.text = text;
  }
}
