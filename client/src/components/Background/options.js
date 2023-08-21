
const Options = {
    background: {
        color: {
            // value: "#35a1ff",
        },
    },
    fpsLimit: 60,
    interactivity: {
        events: {
            onClick: {
                enable: false,
                mode: "push",
            },
            onHover: {
                enable: false,
                mode: "repulse",
            },
            resize: true,
        },
        modes: {
            push: {
                quantity: 7,
            },
            repulse: {
                distance: 200,
                duration: 0.1,
            },
        },
    },
    particles: {
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: {
                default: "bounce",
            },
            random: false,
            speed: 0.5,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 900,
            },
            value: 200,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "square",
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
    detectRetina: true,
}

export default Options;