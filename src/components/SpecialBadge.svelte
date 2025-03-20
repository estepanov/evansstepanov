<div class="ml-2 inline-flex flex-row justify-center items-center">
    <!-- <span class="bg-gradient-to-tr from-emerald-600 to-emerald-400 w-3 h-3 rounded-full"></span> -->
    <span class="animated-badge">
        <slot />
    </span>
</div>

<style lang="postcss">
    .animated-badge {
        @apply px-3 py-1 text-xs ml-2 uppercase rounded-full;
        @apply text-emerald-800 dark:text-emerald-100;
        @apply border border-emerald-300 dark:border-emerald-600;
        @apply relative;
        background: linear-gradient(
            90deg,
            rgb(16 185 129 / 0.15),  /* emerald-500/15 */
            rgb(5 150 105 / 0.25),    /* emerald-600/25 */
            rgb(16 185 129 / 0.15)    /* emerald-500/15 */
        );
        background-size: 200% 100%;
        animation: gradient-slide 3s linear infinite;
    }

    .animated-badge::after {
        content: '';
        @apply absolute inset-0 rounded-full;
        box-shadow: 0 0 10px rgb(6 78 59 / 0.2);  /* emerald-900/20 */
        animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes gradient-slide {
        0% {
            background-position: 100% 0%;
        }
        100% {
            background-position: -100% 0%;
        }
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 5px rgb(6 78 59 / 0.15);
        }
        100% {
            box-shadow: 0 0 15px rgb(6 78 59 / 0.25);
        }
    }

    :global(.dark) .animated-badge {
        background: linear-gradient(
            90deg,
            rgb(16 185 129 / 0.3),   /* emerald-500/30 */
            rgb(5 150 105 / 0.4),     /* emerald-600/40 */
            rgb(16 185 129 / 0.3)     /* emerald-500/30 */
        );
    }

    :global(.dark) .animated-badge::after {
        box-shadow: 0 0 10px rgb(52 211 153 / 0.3);  /* emerald-400/30 */
        animation: glow-dark 2s ease-in-out infinite alternate;
    }

    @keyframes glow-dark {
        0% {
            box-shadow: 0 0 5px rgb(52 211 153 / 0.2);
        }
        100% {
            box-shadow: 0 0 15px rgb(52 211 153 / 0.4);
        }
    }
</style>
