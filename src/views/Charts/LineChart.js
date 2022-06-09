import React from 'react'
import { Line, Area } from 'react-chartjs-2'

function LineChart(props) {

    const data = {
        labels:['First Feb', '8th Feb', '16th Feb', '24th Feb', 'First March', '15th March'],
        datasets:[
            {
                label : 'registered members',
                data:[3,2,2,1,5,4]
            }
        ]
    }
    const options = {
        title: {
            display:true,
            text:'Line Chart'
        },
        scales:{
            yAxes: [
                {
                    ticks:{
                        min:0,
                        max:20,
                        stepSize:1,
                    }
                }
            ]
        }
    }
  return <Line data={data} options = {options} />
}

export default LineChart