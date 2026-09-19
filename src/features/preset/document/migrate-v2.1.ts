import {
  PRESET_DOCUMENT_VERSION,
  presetDocumentSchema,
  type PresetDocument,
} from "./document";
import { CorruptFieldError } from "./errors";

/** Adds neutral per-track FX defaults to v2.1 documents. */
function migrateV21ToDocument(raw: unknown): PresetDocument {
  if (typeof raw !== "object" || raw === null) {
    throw new CorruptFieldError("", "expected a preset document object");
  }

  const result = presetDocumentSchema.safeParse({
    ...(raw as Record<string, unknown>),
    version: PRESET_DOCUMENT_VERSION,
  });
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new CorruptFieldError(issue.path.join("."), issue.message);
  }
  return result.data;
}

export { migrateV21ToDocument };
