import Pusher from "pusher-js";

// Initialisiere Pusher mit deinem Key und Cluster
console.log("Pusher wird initialisiert...");
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
});

export default pusher;
