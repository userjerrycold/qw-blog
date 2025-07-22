declare module 'qrcode' {
  export function toCanvas(
    canvas: HTMLCanvasElement | string,
    text: string,
    options?: {
      width?: number;
      margin?: number;
      scale?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    },
    callback?: (error: Error | null) => void
  ): Promise<HTMLCanvasElement>;

  export function toDataURL(
    text: string,
    options?: {
      width?: number;
      margin?: number;
      scale?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    }
  ): Promise<string>;

  export function toString(
    text: string,
    options?: {
      width?: number;
      margin?: number;
      scale?: number;
      type?: string;
    }
  ): Promise<string>;
} 