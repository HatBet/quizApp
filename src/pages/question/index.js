import {Card, Checkbox, Row, Table, Col, Layout} from "antd";
import React, {useEffect, useMemo, useState} from "react";

const Question = () => {
    const [questionList, setQuestionList] = useState(null);
    const [seconds, setSeconds] = useState(30);
    const [disabledQ, setDisabledQ] = useState(true);
    const [question, setQuestion] = useState(null);
    const [answerList, setAnswerList] = useState(null);
    const questionId = useMemo(() => question?.id, [question]);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        if (questionList === null) {
            fetch("https://jsonplaceholder.typicode.com/posts")
                .then((response) => response.json())
                .then((json) => {
                    return setQuestionList(json.slice(0,10))
                })
                .catch((err) => console.log(err))
        }
        if (questionList && Object.values(questionList).length > 0 && questionList[0]) {
            setQuestion(questionList[0])
        }
    }, [questionList]);

    useEffect(() => {
            const interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds === 20) {
                        // İlk 10 sn sonunda  işaretlenebilir olmalı
                        setDisabledQ(false);
                        return prevSeconds - 1;
                    } else if (prevSeconds === 0) {
                        // yeni soruya geçilmeli
                        const q = questionList?.find((item) => item.id === (questionId +1))
                        setQuestion(q);
                        if(q){
                            setSeconds(30);
                        }
                        setDisabledQ(true);
                        return clearInterval(interval)
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
    
            // ComponentWillUnmount'a karşılık gelir
            return () => clearInterval(interval);
        
    }, [seconds]);

    useEffect(() => {
        if(question === undefined) {
            setSeconds(0);
            setShowTable(true);
        }
    } , [question]);

    const currentAnswer = (val, question, key) => {
        if(val.target.checked) {
            setAnswerList({
                ...answerList,  [question]: {question, key},
            })
        } else if (!val.target.checked) {
            setAnswerList({
                ...answerList,  [question]: {question, key: null},
            })
        }
    };

    const columns = [
        { title: 'Soru', dataIndex: 'question', key: 'question',},
        { title: 'Cevap', dataIndex: 'key', key: 'key',}
    ]

    console.log(question);
    return <Layout className="layoutQuestion">
       <Row gutter={32}>
       <Col span={16}>{showTable ? <h1>Cevaplar</h1> : <h1>Kalan Süre : {seconds}</h1>}</Col>

        <Col>{question && <Card
        title={`${question.id}.soru:  ${question?.title}`}
    >
        <Checkbox disabled={disabledQ}
                  onChange={(val) => currentAnswer(val, question?.id, 'A')}>A {question?.body.substring(1, 8)}</Checkbox>
        <Checkbox disabled={disabledQ}
                  onChange={(val) => currentAnswer(val, question?.id, 'B')}>B {question?.body.substring(5, 9)}</Checkbox>
        <Checkbox disabled={disabledQ}
                  onChange={(val) => currentAnswer(val, question?.id, 'C')}>C {question?.body.substring(4, 6)}</Checkbox>
        <Checkbox disabled={disabledQ}
                  onChange={(val) => currentAnswer(val, question?.id, 'D')}>D {question?.body.substring(8, 10)}</Checkbox>

    </Card>
}</Col>
<Col>{showTable && answerList && <Table columns={columns} dataSource={Object.values(answerList)}/>}
</Col>
       </Row>
    </Layout>
   ;
};

export default Question;
