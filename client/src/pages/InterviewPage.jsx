import Step1SetUp from '../components/Step1SetUp'
import { useState } from 'react'

function InterviewPage() {
    const [step,setStep] = useState(1)
    const [interviewData,setInterviewData] = useState(null)

  return (
    <div className='min-h-screen bg-gray-50'>
        {step===1 && (
            <Step1SetUp onStart={(data)=>{
                setInterviewData(data);
            setStep(2)}}/>
        )}
        
        
        

      
    </div>
  )
}

export default InterviewPage
