/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

window.onload=function () {

    moveHorse = function (x,y) {
        let h = document.getElementById("horse")
        h.style.left = -40 + 60*x +"px"
        h.style.top = -40 + 60*y +"px"
    }
    addTrace = function(t,x,y){
        step = document.getElementsByClassName("inner-step")[0]
        step.innerHTML += t+":("+x+","+y+")<br>"
    }
    clearTrace = function(){
        step = document.getElementsByClassName("inner-step")[0]
        step.innerHTML = ""
    }
    leaveX = function(n,x,y){
        let mark = document.getElementsByClassName("x")[(y-1)*n+x-1]
        mark.style.display = "block"
    }
    calcRoute = function (x,y,startx,starty) {
        let moveStack = []
        let ifTouch = []
        let access= []
        let direction = []
        for(let i = 1;i<=x;i++){
            ifTouch[i]=[]
            access[i]=[]
            direction[i]=[]
            for(let j=1;j<=y;j++){
                ifTouch[i][j]=false
                access[i][j]=8
                direction[i][j]=-1
            }
        }
        for(let i=1;i<=x;i++){
            access[i][1]=4
            access[i][2]=6
            access[i][y-1]=6
            access[i][y]=4
        }
        for(let i=1;i<=y;i++){
            access[1][i]=4
            access[2][i]=6
            access[x-1][i]=6
            access[x][i]=4
        }
        access[1][1]=2;access[x][1]=2;access[1][y]=2;access[x][y]=2
        access[2][2]=4;access[x-1][2]=4;access[2][y-1]=4;access[x-1][y-1]=4
        access[1][2]=3;access[2][1]=3;access[x][2]=3;access[x-1][1]=3;access[1][y-1]=3;access[2][y]=3;access[x-1][y]=3;access[x][y-1]=3;
        fx=[1,2,2,1,-1,-2,-2,-1];
        fy=[2,1,-1,-2,-2,-1,1,2];
        move = function (now) {
            if(moveStack[now].x<1||moveStack[now].x>x||moveStack[now].y<1||moveStack[now].y>y){
                return false
            }
            if(ifTouch[moveStack[now].x][moveStack[now].y]){
                return false
            }
            if(now === x*y){
                return true
            }
            //console.log(now)
            //处理ifTouch和access
            ifTouch[moveStack[now].x][moveStack[now].y]=true
            for(let i = 0;i<8;i++){
                //console.log(now,nowx,nowy)
                if(moveStack[now].x+fx[i]>=1&&moveStack[now].x+fx[i]<=x&&moveStack[now].y+fy[i]>=1&&moveStack[now].y+fy[i]<=y) {
                    access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]--
                }
            }

            // for(let i = 0;i<8;i++){
            //     //console.log(now,nowx,nowy)
            //     moveStack[now+1]={x:moveStack[now].x+fx[i],y:moveStack[now].y+fy[i]}
            //     if(move(now+1)) {
            //         return true
            //     }else {
            //         moveStack[now+1]=null
            //     }
            // }
            //递归

            while (true){
                //该点第一次遍历
                //console.log(now,moveStack[now].x,moveStack[now].y)
                //console.log(direction)
                //console.log(1)
                if (direction[moveStack[now].x][moveStack[now].y]===-1){
                    //console.log(2)
                    min = 10
                    di = -1
                    //找最小方向
                    for(let i = 0;i<8;i++){
                        if((moveStack[now].x+fx[i]>=1&&moveStack[now].x+fx[i]<=x&&moveStack[now].y+fy[i]>=1&&moveStack[now].y+fy[i]<=y)&&!ifTouch[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]) {
                            if(access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]<min){
                                min=access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]
                                di=i
                            }
                        }
                    }
                    //有无最小方向
                    if(di===-1){
                        break;
                    }else {
                        direction[moveStack[now].x][moveStack[now].y]=di
                            moveStack[now+1]={x:moveStack[now].x+fx[di],y:moveStack[now].y+fy[di]}
                            if(move(now+1)) {
                                return true
                            }else {
                                moveStack[now+1]=null
                            }
                    }
                }
                //非第一次遍历
                else {
                    //console.log(3)
                    min=access[moveStack[now].x+fx[direction[moveStack[now].x][moveStack[now].y]]][moveStack[now].y+fy[direction[moveStack[now].x][moveStack[now].y]]]
                    di = -1
                    //查找相同值
                    for(let i =direction[moveStack[now].x][moveStack[now].y]+1;i<8;i++){
                        if((moveStack[now].x+fx[i]>=1&&moveStack[now].x+fx[i]<=x&&moveStack[now].y+fy[i]>=1&&moveStack[now].y+fy[i]<=y)&&!ifTouch[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]) {
                            if(access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]===min){
                                min=access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]
                                di=i
                                break;
                            }
                        }
                    }
                    //存在相同值
                    if(di!==-1){
                        direction[moveStack[now].x][moveStack[now].y]=di
                        moveStack[now+1]={x:moveStack[now].x+fx[di],y:moveStack[now].y+fy[di]}
                        if(move(now+1)) {
                            return true
                        }else {
                            moveStack[now+1]=null
                        }
                    }
                    //不存在相同值
                    else {
                        lastmin = min
                        min = 10
                        for(let i = 0;i<8;i++){
                            if((moveStack[now].x+fx[i]>=1&&moveStack[now].x+fx[i]<=x&&moveStack[now].y+fy[i]>=1&&moveStack[now].y+fy[i]<=y)&&!ifTouch[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]) {
                                if(access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]<min&&access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]>lastmin){
                                    min=access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]
                                    di=i
                                }
                            }
                        }
                        //有无最小方向
                        if(di===-1){
                            break;
                        }else {
                            direction[moveStack[now].x][moveStack[now].y]=di
                            moveStack[now+1]={x:moveStack[now].x+fx[di],y:moveStack[now].y+fy[di]}
                            if(move(now+1)) {
                                return true
                            }else {
                                moveStack[now+1]=null
                            }
                        }
                    }
                }

            }

            //还原ifTouch和access
            for(let i = 0;i<8;i++){
                if(moveStack[now].x+fx[i]>=1&&moveStack[now].x+fx[i]<=x&&moveStack[now].y+fy[i]>=1&&moveStack[now].y+fy[i]<=y) {
                    //console.log(access,moveStack[now].x+fx[i],moveStack[now].y+fy[i])
                    access[moveStack[now].x+fx[i]][moveStack[now].y+fy[i]]++
                }
            }
            ifTouch[moveStack[now].x][moveStack[now].y]=false
            direction[moveStack[now].x][moveStack[now].y]=-1

            return false
        }
        moveStack[1]={x:startx,y:starty}
        return  {flag:move(1),stack:moveStack}

    }

    x = document.getElementById("x")
    y = document.getElementById("y")
    startx = document.getElementById("start-x")
    starty = document.getElementById("start-y")
    const { ipcRenderer } = require('electron')
    var interval

    document.getElementById("quit").addEventListener("click",function () {
        ipcRenderer.send("close")
    })
    document.getElementById("start").addEventListener("click",function () {
        xValue = parseInt(x.value)
        yValue = parseInt(y.value)
        startxValue = parseInt(startx.value)
        startyValue = parseInt(starty.value)
        checksize = function (t,max,min) {
            return t<=max && t>=min &&t
        }

        if(checksize(xValue,99,1) &&
            checksize(yValue,99,1)&&
            checksize(startxValue,xValue,1)&&
            checksize(startyValue,yValue,1)){


            //绘制棋盘格
            grid = document.getElementsByClassName("grid")[0]
            str = "<div id=\"horse\"></div>"
            for (let i=0;i<(xValue-1)*(yValue-1);i++){
                str += "<div class=\"item\"></div>"
            }
            for(let i=1;i<=yValue;i++){
                for (let j=1;j<=xValue;j++){
                    str += "<div class='x' style='left: "+ (-40 + 60*j) +"px;top:"+ (-40 + 60*i) + "px' >x</div>"
                }
            }
            grid.innerHTML = str

            //移动马到初始位置
            grid.style.gridTemplateColumns = "repeat("+(xValue-1)+", 60px)"
            grid.style.gridTemplateRows = "repeat("+(yValue-1)+", 60px)"
            moveHorse(startxValue,startyValue)

            obj = calcRoute(xValue,yValue,startxValue,startyValue)
            stack = obj.stack
            if(!obj.flag) {
                ipcRenderer.send("nosolution")
            }
            let t = 1
            clearTrace()
            clearInterval(interval)
            interval = setInterval(function () {
                if(!stack[t]){
                    clearInterval(interval)
                    return
                }
                if(t>1)
                    leaveX(xValue,stack[t-1].x,stack[t-1].y)
                moveHorse(stack[t].x,stack[t].y)
                addTrace(t,stack[t].x,stack[t].y)
                t++
            },1000)
        }else {
            ipcRenderer.send("inputerror")
        }
    })
}
