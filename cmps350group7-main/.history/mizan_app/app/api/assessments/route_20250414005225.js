import fs from "fs";
import path from "path";

const  filePath = path.join(process.cwd(),'mizan_app','mizan-data','assessments.json');

export async function GET(){
    const data = JSON.parse(fs.readFileSync(filePath));
    return response.JSON(data);
}

export async function POST(request){
    const newAssessment = await request.JSON();
    const date = JSON.parse(fs.readFileSync(filePath));

    newAssessment.id = DataTransfer.now().toString();
    data.push(newAssessment);
    fs.writeFileSync(filePath,JSON.stringify(data,null,2));

    return Response.json(newAssessment, {status:201});
}