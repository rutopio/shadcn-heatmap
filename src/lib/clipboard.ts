import { toast } from "sonner";

export async function copyText(
  text: string,
  message = "Copied to clipboard",
  description?: string,
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message, { description });
    return true;
  } catch {
    toast.error("Could not copy. Please select and copy the text manually.");
    return false;
  }
}
