document.addEventListener("DOMContentLoaded",async function(){
    const res=await fetch("mizan-data/assessments.json")
    let data=[]
    if (res.ok){
        data=await res.json()
    }
    else{
        console.error()
    }
})