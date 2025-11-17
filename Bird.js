let move_speed = 3, grativy = 0.5;

// Bird & Images
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

// Sounds
let sound_point = new Audio('sounds_effect/point.mp3');
let sound_die = new Audio('sounds_effect/die.mp3');

// 🔥 Background music (fixed)
let sound_bg = new Audio('bg.mp3');
sound_bg.loop = true;
sound_bg.volume = 0.7;

// Bird properties
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');


// =================== START GAME ===================
document.addEventListener('keydown', (e) => {

    if (e.key == 'Enter' && game_state != 'Play') {

        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());

        img.style.display = 'block';
        bird.style.top = '40vh';

        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');

        sound_bg.play();  // 🔥 background sound starts

        play();
    }
});


// =================== MAIN GAME FUNCTION ===================
function play() {

    // ---------- PIPE MOVEMENT ----------
    function move() {

        if (game_state != 'Play') return;

        let pipe_sprites = document.querySelectorAll('.pipe_sprite');

        pipe_sprites.forEach((element) => {

            let pipe_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            // Remove off-screen pipes
            if (pipe_props.right <= 0) {
                element.remove();
            }
            else {
                // Collision detection
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    game_state = 'End';
                    img.style.display = 'none';
                    sound_die.play();

                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    return;
                }

                // Score update
                if (
                    pipe_props.right < bird_props.left &&
                    pipe_props.right + move_speed >= bird_props.left &&
                    element.increase_score == '1'
                ) {
                    score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                    sound_point.play();
                }

                // Move pipes left
                element.style.left = pipe_props.left - move_speed + 'px';
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);


    // ---------- APPLY GRAVITY ----------
    let bird_dy = 0;

    function apply_gravity() {

        if (game_state != 'Play') return;

        bird_dy += grativy;

        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                bird_dy = -7.6;
                img.src = 'images/modi.png';
            }
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            window.location.reload();
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);


    // ---------- CREATE PIPES ----------
    let pipe_gap = 35;
    let pipe_separation = 0;

    function create_pipe() {

        if (game_state != 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_pos = Math.floor(Math.random() * 43) + 8;

            // Top pipe
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_pos - 70 + 'vh';
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);

            // Bottom pipe
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
