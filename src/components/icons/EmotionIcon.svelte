<script lang="ts">
	export let size: number = 24;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 400 400"
	width={size}
	height={size}
	fill="currentColor"
	aria-hidden="true"
>
	<!-- Hair silhouette (back layer) -->
	<path
		opacity="0.35"
		d="M110 130 C 110 70, 155 35, 205 35 C 270 35, 320 75, 322 150 L 332 230 L 332 295 L 295 275 L 295 325 L 255 305 L 248 355 C 220 365, 180 365, 152 355 L 145 305 L 105 325 L 105 275 L 68 295 L 78 200 Z"
	/>

	<!-- Jacket / shoulders (back layer) -->
	<path
		opacity="0.35"
		d="M40 400 L 40 330 L 150 295 L 200 365 L 250 295 L 360 330 L 360 400 Z"
	/>

	<!-- Face (mid layer) -->
	<path
		opacity="0.55"
		d="M135 150 C 135 115, 165 95, 200 95 C 240 95, 270 115, 270 152 L 270 235 C 270 268, 245 295, 215 300 L 215 320 L 185 320 L 185 300 C 155 295, 130 268, 130 235 Z"
	/>

	<!-- Hair strand sweeping across forehead/cheek -->
	<path
		opacity="0.55"
		d="M118 110 C 150 145, 195 165, 240 150 C 215 175, 175 180, 145 165 L 130 195 C 122 175, 116 145, 118 110 Z"
	/>

	<!-- Sideburn / hair tuft on right cheek -->
	<path opacity="0.55" d="M275 200 L 295 230 L 282 270 L 270 250 Z" />

	<!-- Jacket collar (V-neck, mid layer) -->
	<path
		opacity="0.55"
		d="M148 300 L 200 365 L 252 300 L 240 326 L 200 372 L 160 326 Z"
	/>

	<!-- Lightning bolt across face (foreground) -->
	<path
		fill-rule="evenodd"
		d="M170 90 L 228 96 L 196 178 L 248 180 L 178 282 L 204 212 L 150 206 Z M 188 130 L 215 134 L 197 178 L 220 180 L 188 232 L 200 200 L 178 196 Z"
	/>

	<!-- Eyebrows -->
	<path d="M154 178 Q 172 170, 188 180 L 186 184 Q 172 176, 156 184 Z" />
	<path d="M222 178 Q 240 170, 256 180 L 254 184 Q 240 176, 224 184 Z" />

	<!-- Left eye (peeking through bolt) -->
	<ellipse cx="172" cy="202" rx="6" ry="8" />
	<!-- Right eye -->
	<ellipse cx="240" cy="202" rx="9" ry="11" />
	<!-- Eye highlights (negative space via face-tone overlay) -->
	<circle cx="243" cy="199" r="2.5" opacity="0.55" />

	<!-- Nose (subtle) -->
	<path opacity="0.85" d="M205 215 Q 212 235, 218 248 Q 210 252, 200 250 Q 198 240, 205 215 Z" />

	<!-- Mouth / lips -->
	<path d="M178 258 Q 200 274, 222 258 Q 215 263, 200 263 Q 185 263, 178 258 Z" />
	<path opacity="0.55" d="M186 264 Q 200 270, 214 264 Q 200 268, 186 264 Z" />

	<!-- Lapel lightning bolt -->
	<path d="M222 332 L 240 336 L 228 352 L 244 354 L 214 382 L 226 358 L 212 354 Z" />
</svg>
