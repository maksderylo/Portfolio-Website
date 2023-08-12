import { useCallback} from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import '../styles/particles.css';


const Particlees = () => {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        console.log(container);
    }, []);

    return (
      
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "#000000",
                },
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  resize: true,
                },
              },
              particles: {
                color: ["#ff0000", "#00ff00", "#0000ff"],

                links: {
                  color: [ "#ff0266"],
                  distance: 150,
                  enable: true,
                  opacity: 0.7,
                  width: 1,
                },
                move: {
                  direction: "random",
                  enable: true,
                  outModes: {
                    default: "out",
                  },
                  random: true,
                  speed: 1,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 200,
                },
                opacity: {
                  value: 1,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 0, max: 0 },
                },
              },
              detectRetina: true,
            }}
        />
        
    );
};

export default Particlees