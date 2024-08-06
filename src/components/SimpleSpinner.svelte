<script lang="ts">
    export let size: number = 40;
    export let color: string = '#000';
  </script>
  
  <style>
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top: 4px solid var(--spinner-color);
      border-radius: 50%;
      width: var(--spinner-size);
      height: var(--spinner-size);
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>
  
  <div class="spinner" style="--spinner-size: {size}px; --spinner-color: {color};"></div>
  