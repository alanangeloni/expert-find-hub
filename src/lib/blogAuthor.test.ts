import test from "node:test";
import assert from "node:assert/strict";
import {
  HOUSE_BYLINE,
  blogAuthorColumn,
  friendlyDatabaseError,
  resolveAuthorId,
  type AuthorCandidate,
} from "./blogAuthor.ts";

const HOUSE_ID = "210cc2cc-a5a8-4724-8100-61fbf7d081f6";

const houseAuthor = (): AuthorCandidate => ({
  id: HOUSE_ID,
  name: `${HOUSE_BYLINE} `,
  slug: "financial-professional",
});

test("blank author is stored as no author", () => {
  for (const value of [null, undefined, "", "   "]) {
    assert.deepEqual(resolveAuthorId(value, [houseAuthor()]), { id: null });
    assert.equal(blogAuthorColumn(value as string | null | undefined), null);
  }
});

test("uuid inputs are trimmed and canonicalized", () => {
  const padded = `  ${HOUSE_ID.toUpperCase()}  `;
  assert.deepEqual(resolveAuthorId(padded, []), { id: HOUSE_ID });
  assert.equal(blogAuthorColumn(padded), HOUSE_ID);
});

test("the Financial Professional byline resolves to the profile id, including the trailing space", () => {
  const resolved = resolveAuthorId(`${HOUSE_BYLINE} `, [houseAuthor()]);
  assert.deepEqual(resolved, { id: HOUSE_ID });
  assert.equal(resolved.id === `${HOUSE_BYLINE} `, false);
});

test("a slug match resolves to the same profile id", () => {
  assert.deepEqual(resolveAuthorId("financial-professional", [houseAuthor()]), { id: HOUSE_ID });
});

test("an unknown display name is rejected and never written", () => {
  const resolved = resolveAuthorId(`${HOUSE_BYLINE} `, []);
  assert.equal(resolved.id, null);
  assert.match(resolved.error ?? "", /UUID/);
  assert.match(resolved.error ?? "", new RegExp(HOUSE_BYLINE));
  assert.throws(() => blogAuthorColumn(`${HOUSE_BYLINE} `), /UUID/);
});

test("an optional legacy byline with no matching row is left unset", () => {
  assert.deepEqual(resolveAuthorId(`${HOUSE_BYLINE} `, [], { required: false }), { id: null });
});

test("duplicate names are not guessed", () => {
  const other: AuthorCandidate = {
    id: "d6f61d15-be45-40b3-845d-479eb4b8962b",
    name: HOUSE_BYLINE,
  };
  const required = resolveAuthorId(HOUSE_BYLINE, [houseAuthor(), other]);
  assert.equal(required.id, null);
  assert.match(required.error ?? "", /more than one profile/);
  assert.deepEqual(resolveAuthorId(HOUSE_BYLINE, [houseAuthor(), other], { required: false }), {
    id: null,
  });
});

test("a non-uuid candidate id cannot be selected by name", () => {
  const resolved = resolveAuthorId(HOUSE_BYLINE, [{ id: HOUSE_BYLINE, name: HOUSE_BYLINE }]);
  assert.equal(resolved.id, null);
  assert.match(resolved.error ?? "", /display name/);
});

test("the sql editor uuid toast becomes a field error", () => {
  const message = friendlyDatabaseError(
    'Failed to run sql query: ERROR: 22P02: invalid input syntax for type uuid: "Financial Professional "'
  );
  assert.equal(
    message,
    'Author must be a profile id (UUID), not a display name ("Financial Professional").'
  );
});
