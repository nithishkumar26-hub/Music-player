<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->
<script>
  import { goto } from "$app/navigation";
    
    import {onMount} from "svelte"

    onMount(()=>{
        goto("/musicone")
    })
</script>



