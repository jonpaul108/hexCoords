

//making mao from hexagons with cubed coords

const hexagonMap = (sides) => {

    //creating our hex class
    class Hex {
      constructor(q, r, s) {
        this.q = q;
        this.s = s;
        this.r = r;
      };
    }
  
    //creating our cubed coords for hex based on n (length of hex sides, or, number of hexes from side to one before center on longest row)
    class HexCoords {
      constructor(n) {
        this.coords = [];
        this.hexsFromCenter = n;
      }
    //test that hex coords equal zero. if they don't, discard
      hexCoordsEqualZero(q, r, s) {
        let bool = true;
        if (Math.round(q + r + s) !== 0) {
          bool = false;
        }
        return bool;
      }
      
    //create coordinates. not optimized. three nested loops
      makeCoords() {
        const coords = this.coords;
        const start = -this.hexsFromCenter;
        const end = this.hexsFromCenter;
        for (let i = start; i <= end; i ++ ) {
          for (let j = start; j <= end; j ++) {
            for (let y = start; y <= end; y ++) {
              if (this.hexCoordsEqualZero(i, j, y)) {
                coords.push(new Hex(i, j, y));
              }
            }
          }
        }
      }
    }
  
  
  
    class MakeMap {
  
      constructor(n) {
        this.n = n;
        this.map = [];
        this.hexes = new HexCoords(n);
  
        this.hexes.makeCoords();
      }
  
      createMap() {
        const n = (this.n * 2) + 1; 
        const arrMap = this.map;
        let i = 0;
        while(i < n) {
          arrMap.push([]);
          i ++;
        };
      }
  
      coordsToMatrix() {
        const cubedCoords = this.hexes.coords;
        const map = this.map;
        const n = this.n;
  
        let row, col, hex;
        for (let i = 0; i < cubedCoords.length; i ++) {
          hex = cubedCoords[i];
          row = hex.r - (-n);
          if (row <= n) {
            col = hex.q + (n - (-hex.r));
          }
          else { 
            col = hex.q + (n - (-hex.r)) - (row - n);
          }
          hex.row = row;
          hex.col = col;
          map[row][col] = hex;
        }
      }
    }
  
    const gameMap = new MakeMap(sides);
    gameMap.createMap();
    gameMap.coordsToMatrix();
    return gameMap;
  }
  
  const hexMap1 = hexagonMap(1).map;
  const hexMap2 = hexagonMap(2).map;
  const hexMap3 = hexagonMap(3).map;
  // console.log('///////hexMap1///////: ', map);
  // console.log('///////hexMap2/////: ', map);
  
  
  //finding the distance between hexagons based on cubed coords
  //example func
  // function cubeDistance(a, b){
    //a and b are hexagons on the map
    //I'm not using x y x, will be q s r
    //I realize this is confusing. It's becasue the 'docs' are not consistant on this point. They were more consistantly q, r, s (*shrug)
  //     return max(abs(a.x - b.x), abs(a.y - b.y), abs(a.z - b.z))
  // }
  
  ////////Use this func for my hexes////////
  function cubeDist(aHex, bHex) {
    return Math.max(Math.abs(aHex.q - bHex.q), Math.abs(aHex.s - bHex.s), Math.abs(aHex.r - bHex.r));
  }
  
  
  //example: 
  
  const dist1 = cubeDist(hexMap1[0][0], hexMap1[0][1]);
  const dist2 = cubeDist(hexMap1[2][1], hexMap1[0][0]);
  const dist3 = cubeDist(hexMap3[3][3], hexMap3[4][5]);
  console.log('dist1: ', dist1); // ==> 1
  console.log('dist2: ', dist2); // ==> 2
  console.log('dist3: ', dist3); // ==> 3
  
  //finding floating points between two distances:
  
  //p = how many points between
  //d = distance between two points
  //a = starting point
  //b = end point
  
  
  // const findFloatingPoints = (a, b, p, d ) => {
  //     //A + (B - A) * 1.0/N * i
  //     const points = [];
  //     let curP;
  //     for(let i = 0; i < p; i ++) {
  //       curP = a + (b - a) * 1.0/d * i; 
  //       points.push(curP);
  //     }
  //     return points;
  // }
  class Cube {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    };
  }
  
  //finds floating points and rounds them off, returns an array of all points (as hexagon cubed coords) between two hexes
  const findPoints = (a, b, p) => {
      //A + (B - A) * 1.0/N * i
      const points = [];
      let curQ, curR, curS;
      const dist = cubeDist(a, b);
      for(let i = 0; i <= dist; i ++) {
        let cube;
        curQ = a.q + (b.q - a.q) * 1.0/dist * i; 
        curS = a.s + (b.s - a.s) * 1.0/dist * i; 
        curR = a.r + (b.r - a.r) * 1.0/dist * i; 
        //round out the floating points
        cube = cubeRound(new Cube(curQ, curS, curR));
  
        points.push(cube);
      }
      return points;
  }
  
  //use this to round off the points when finding flaoting points, to now which Hex we are in
  
   const cubeRound = (cube) => {
      let rx = Math.round(cube.x);
      let ry = Math.round(cube.y);
      let rz = Math.round(cube.z);
  
      const xDiff = Math.abs(rx - cube.x);
      const yDiff = Math.abs(ry - cube.y);
      const zDiff = Math.abs(rz - cube.z);
  
      if (xDiff > yDiff && xDiff > zDiff){
          rx = -ry-rz
      }
      else if (yDiff > zDiff) {
          ry = -rx-rz
      }
      else {
          rz = -rx-ry
  
      }
      cube.x = rx;
      cube.y = ry;
      cube.z = rz;
  
      return cube;
  }
  
  
  console.log(hexMap3);
  const points = findPoints(hexMap3[3][3], hexMap3[4][5], 3);
  console.log(points);