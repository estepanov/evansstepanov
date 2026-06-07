import { Client, APIResponseError, APIErrorCode } from "@notionhq/client"
import type { QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { NOTION_TOKEN } from '$env/static/private';

const RETRYABLE_CODES = new Set([
  APIErrorCode.RateLimited,
  APIErrorCode.InternalServerError,
  APIErrorCode.ServiceUnavailable,
]);

export const notion = new Client({
    auth: NOTION_TOKEN,
  })

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      if (attempt === retries || !APIResponseError.isAPIResponseError(err) || !RETRYABLE_CODES.has(err.code)) {
        throw err;
      }
      const retryAfter = err.headers?.get?.('retry-after');
      const delay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : baseDelay * Math.pow(2, attempt) + Math.random() * 500;
      console.warn(`Notion ${err.code}, retrying in ${Math.round(delay)}ms (retry ${attempt + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('unreachable');
}

export async function queryNotion(params: QueryDatabaseParameters): Promise<QueryDatabaseResponse> {
  return retryWithBackoff(() => notion.databases.query(params));
}
