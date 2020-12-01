import Question from '../models/question'
import Answer from '../models/answer'

exports.GetContents = async (req, res) => {

  // TODO : get questions from mongodb and return to frontend
  Question.find()
  .sort({ _id: 1 })
  .exec((err, r) => {
    if (err){
      res.status(403).send({message: 'error', contents: []})
    }
    if (r==[] || r==undefined){
      res.status(403).send({message: 'error', contents: []})
    }else{
      res.status(200).send({message: 'success', contents: r})
    }
  })
  
}

exports.CheckAns = async (req, res) => {
  // TODO : get answers from mongodb,
  let client_ans = req.body.ans
  // console.log(client_ans)
  // res.status(200).send({message: 'try', score: client_ans})
  
  Answer.find()
  .sort({ _id: 1 })
  .exec((err, r) => {
    if (err){
      res.status(403).send({message: 'error', score: -1})
    }
    // initialize app with existing messages
    if (r==[] || r==undefined || r.length!=client_ans.length){
      res.status(403).send({message: 'error', score: -1})
    }else{
      // res.status(200).send(JSON.stringify({message: "success", score:r}))
  // //     console.log(r)
      let score = 0
      for (let i=0; i<client_ans.length; i++){
        if(r[i].answer == client_ans[i]){
          score++;
        }
      }
      res.status(200).send({message: 'success', score: score})
    }
  })
  // check answers coming from frontend and return score to frontend
}
