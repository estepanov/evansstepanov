export interface Quote {
	text: string;
	attribution: string;
}

export function pickRandomQuote(quotes: Quote[], fallback: Quote): Quote {
	if (quotes.length === 0) return fallback;
	if (quotes.length === 1) return quotes[0];
	return quotes[Math.floor(Math.random() * quotes.length)];
}

function isEdisonQuote(quote: Quote): boolean {
	return /Edison/i.test(quote.attribution);
}

export function ssrFooterQuote(quotes: Quote[], lastResort: Quote): Quote {
	return quotes.find(isEdisonQuote) ?? quotes[0] ?? lastResort;
}
