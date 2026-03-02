export class Base64Utils {
  public static arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  public static base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64Padded = base64 + padding;
    const binary = atob(base64Padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public static base64UrlToString(base64url: string): string {
    const buffer = this.base64UrlToArrayBuffer(base64url);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
  }
}
