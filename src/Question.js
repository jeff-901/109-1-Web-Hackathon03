import React, { Component } from 'react'
import axios from 'axios'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

class Question extends Component {
  constructor(props) {
    super(props)
    this.state = {
      complete: false,    // true if answered all questions
      contents: [],       // to store questions
      ans: [],            // to record your answers
      score: 0,           // Your score
      current_question: 0 // index to current question
    }
  }

  next = async () => {
    // TODO : switch to the next question,
    // and check answers to set the score after you finished the last question 
    if (this.state.current_question + 1 == this.state.ans.length){
      // console.log("you have select one ans")
      if (this.state.ans.length == this.state.contents.length){
        let ans = this.state.ans
        
        let response = await instance.post('/checkAns', {ans, ans})
        
        // console.log(response)
        let data = response.data
        // console.log(data)
        this.setState({complete:true, score: data.score})
      }else{
        this.setState(state=>({current_question: state.current_question + 1}))
      }
    }  
  }

  choose = (i) => {
    // TODO : update 'ans' for the option you clicked
    let new_ans = [...this.state.ans]
    if (new_ans.length <= this.state.current_question){
      new_ans.push(Number(i))
      this.setState({ans: new_ans})
    }else{
      new_ans[this.state.current_question] = Number(i)
      this.setState({ans: new_ans})
    }
  }

  getQuestions = async () => {
    // TODO : get questions from backend
    let response = await instance.get('/getContents')
    let data = response.data
    // console.log(data)
    if (data.message=='error' || data.contents==undefined){
      console.log('ERROR getcontents')
    }else{
      this.setState({contents: data.contents})
    }
  }

  componentDidMount() {
    this.getQuestions()
  }

  // TODO : fill in the rendering contents and logic
  render() {
    const contents = this.state.contents
    const current = this.state.current_question
    const score = this.state.score
    const ans = this.state.ans
    const complete = this.state.complete

    return (
      <div id="quiz-container">
        {contents.length ?
          <React.Fragment>
            <div id="question-box">
              <div className="question-box-inner">
                Question {this.state.current_question+1} of {this.state.contents.length}
              </div>
            </div>

            <div id="question-title">
              
              {complete?"Your Score : "+String(this.state.score)+" / "+String(this.state.contents.length)
              :this.state.contents[this.state.current_question].question}

            </div>
            {complete?<div></div>:
            <React.Fragment>
            <div id="options">
            {
              this.state.contents[this.state.current_question].options.map((x, i) => {
                // console.log(x)
                return(
                <div className="each-option">
                  <input type="radio" id={"q"+String(this.state.current_question+1)+"_"+String(i+1)}
                  checked={this.state.ans.length == this.state.current_question + 1 && this.state.ans[this.state.current_question] - 1 == i}
                  onChange={()=>{this.choose(i+1)}}/>
                  <span>{x}</span>
                </div>)
              })
            }
            </div>
            
            <div id="actions" onClick={this.next}>
              NEXT
            </div>
            </React.Fragment>
            }
          </React.Fragment>
          : <React.Fragment></React.Fragment>
        }
      </div>
    )
  }
}

export default Question
