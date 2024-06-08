const b1 = document.getElementById("b1")
const b2 = document.getElementById("b2")
const b3 = document.getElementById("b3")

// ゲーム状態
let state = ""

// セル正方形のサイズ
const cellSize = 30

// マスに入るオブジェクト
class Grid {
    constructor() {
        this.bomb = false
        this.count = 0
        this.open = false
        this.flag = false
    }
}

// マスの配列
let grids = []

// マスの縦横と爆弾数
let h, w, bomb

// 周辺
const surroundArray = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
]

// 画像
let img0, img1, img2, img3, img4, img5, img6, img7, img8, click_bomb, empty_block, flag

function preload() {
    img0 = loadImage('img/0.png');
    img1 = loadImage('img/1.png');
    img2 = loadImage('img/2.png');
    img3 = loadImage('img/3.png');
    img4 = loadImage('img/4.png');
    img5 = loadImage('img/5.png');
    img6 = loadImage('img/6.png');
    img7 = loadImage('img/7.png');
    img8 = loadImage('img/8.png');
    click_bomb = loadImage('img/click_bomb.png');
    empty_block = loadImage('img/empty_block.png');
    flag = loadImage('img/flag.png');
}

function setup() {
    const canvas = createCanvas(400, 400)
    canvas.parent("canvas_div")
    // 左クリック
    document.querySelector("canvas").addEventListener("click", (e) => {
        click1()
    })
    // 右クリック
    document.querySelector("canvas").addEventListener("contextmenu", (e) => {
        e.preventDefault()
        click2()
    })
    frameRate(20)
}

function draw() {
    if (state === "start") {
        for (let y = 0; y < grids.length; y++) {
            for (let x = 0; x < grids[y].length; x++) {
                if (grids[y][x].flag) {
                    image(flag, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].open) {
                    if (grids[y][x].count === 0) {
                        image(img0, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 1) {
                        image(img1, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 2) {
                        image(img2, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 3) {
                        image(img3, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 4) {
                        image(img4, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 5) {
                        image(img5, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 6) {
                        image(img6, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 7) {
                        image(img7, x * cellSize, y * cellSize, cellSize, cellSize);
                    } else if (grids[y][x].count === 8) {
                        image(img8, x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                } else {
                    image(empty_block, x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    if (state === "over") {
        for (let y = 0; y < grids.length; y++) {
            for (let x = 0; x < grids[y].length; x++) {
                if (grids[y][x].bomb === true) {
                    image(click_bomb, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 0) {
                    image(img0, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 1) {
                    image(img1, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 2) {
                    image(img2, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 3) {
                    image(img3, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 4) {
                    image(img4, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 5) {
                    image(img5, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 6) {
                    image(img6, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 7) {
                    image(img7, x * cellSize, y * cellSize, cellSize, cellSize);
                } else if (grids[y][x].count === 8) {
                    image(img8, x * cellSize, y * cellSize, cellSize, cellSize);
                } else {
                    image(empty_block, x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        noLoop()
    }
}

function click1() {
    if (state === "start") {
        const y = floor(mouseY / cellSize)
        const x = floor(mouseX / cellSize)
        if (!grids[y][x].flag) {
            if (grids[y][x].bomb) {
                state = "over"
                alert("💣 ゲームオーバー！あなたの負けです。")
            } else {
                grids[y][x].open = true
                searchRecursion(y, x)
                checkClear()
            }
        }
    }
}

function click2() {
    if (state === "start") {
        const y = floor(mouseY / cellSize)
        const x = floor(mouseX / cellSize)
        grids[y][x].flag = !grids[y][x].flag
    }
}

function checkClear() {
    let i = 0
    for (const v of grids) {
        for (const obj of v) {
            if (obj.open) {
                i++
            }
        }
    }
    if ((h * w - bomb) === i) {
        state = "over"
        alert("🎉 おめでとうございます！あなたの勝ちです！")
        noLoop()
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1))
        let tmp = array[i]
        array[i] = array[r]
        array[r] = tmp
    }
    return array
}

function makeArr(row, col, bombNum) {
    const all = row * col
    let tmp = []
    for (let i = 0; i < all; i++) {
        const obj = new Grid()
        if (i < bombNum) {
            obj.bomb = true
            tmp.push(obj)
        } else {
            tmp.push(obj)
        }
    }

    const shuffleTmp = shuffleArray(tmp)

    tmp = []
    let i = 0
    for (let y = 0; y < row; y++) {
        const tmp2 = []
        for (let x = 0; x < col; x++) {
            tmp2.push(shuffleTmp[i])
            i++
        }
        tmp.push(tmp2)
    }

    return tmp
}

function lookAround(y, x) {
    let count = 0

    for (const v of surroundArray) {
        const row = y + v[0]
        const col = x + v[1]
        if (row >= 0 && col >= 0 && row < h && col < w) {
            if (grids[row][col].bomb) {
                count++
            }
        }
    }

    return count
}

function searchRecursion(y, x) {
    // 爆弾は終了
    if (grids[y][x].bomb) {
        return
    }

    // 1以上なら開けて終了
    if (grids[y][x].count > 0) {
        grids[y][x].open = true
        return
    }

    for (const v of surroundArray) {
        const row = y + v[0]
        const col = x + v[1]
        if (row >= 0 && col >= 0 && row < h && col < w) {
            // 訪問済みでない
            if (!grids[row][col].open) {
                grids[row][col].open = true
                // 再帰する前にチェックを行う
                if (grids[row][col].count === 0) {
                    // 再帰する
                    searchRecursion(row, col)
                }
            }
        }
    }
}

function levelChoice(n) {
    const level = {
        // 縦9×横9のマスに10個の地雷
        1: [9, 9, 10],
        // 縦16×横16のマスに40個の地雷
        2: [16, 16, 40],
        // 縦16×横30のマスに99個の地雷
        3: [16, 30, 99],
    }
    const [r, c, b] = level[n]
    h = r
    w = c
    bomb = b
    grids = makeArr(r, c, b)
    resizeCanvas(c * cellSize, r * cellSize)

    // 周辺調査
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < c; x++) {
            if (!grids[y][x].bomb) {
                grids[y][x].count = lookAround(y, x)
            }
        }
    }

    state = "start"
    loop()
}

b1.addEventListener("click", () => {
    levelChoice(1)
})

b2.addEventListener("click", () => {
    levelChoice(2)
})

b3.addEventListener("click", () => {
    levelChoice(3)
})
