// console.log("load");

// setTimeout(()=>{
// console.log("loading");
// }, 3000)



// console.log("end");

function cal (x, y, display){
    setTimeout(()=>{
        console.log("prosessing");
        const sum = x+y
        display(sum)
    }, 3000)

}

// function display (result){
// console.log("result is  " + result);
// }

const sum = cal(100,50, (result) =>console.log(result)
)

// display(sum)