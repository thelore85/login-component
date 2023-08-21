import React from "react";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import Options from "./options.js";

import './Background.css';


const Background = () => {

    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await container;
    }, []);

    return (
         <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={Options}
        />
    );
}

export default Background;