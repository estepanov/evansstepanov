import { describe, expect, it } from 'vitest';
import { pickRandomQuote, type Quote } from './pick-random-quote';

const edison: Quote = {
	text: "I have not failed. I've just found 10,000 ways that won't work.",
	attribution: 'Thomas A. Edison'
};

const jobs: Quote = {
	text: 'Stay hungry. Stay foolish.',
	attribution: 'Steve Jobs'
};

const yoda: Quote = {
	text: 'Do or do not. There is no try.',
	attribution: 'Yoda'
};

describe('pickRandomQuote', () => {
	it('returns the fallback when the list is empty', () => {
		expect(pickRandomQuote([], edison)).toEqual(edison);
	});

	it('always returns the only quote', () => {
		expect(pickRandomQuote([jobs], edison)).toEqual(jobs);
		expect(pickRandomQuote([edison], edison)).toEqual(edison);
	});

	it('returns a quote from the provided set when there are several', () => {
		const quotes = [edison, jobs, yoda];
		for (let i = 0; i < 40; i++) {
			expect(quotes).toContainEqual(pickRandomQuote(quotes, jobs));
		}
	});
});
