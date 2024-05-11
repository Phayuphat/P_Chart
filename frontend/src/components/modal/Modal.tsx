"use client";
import React, { useState, useEffect} from 'react';
import { Modal, Input, Space, Switch, Button, Row, Col, Flex, Form} from 'antd';
import {CloseSquareOutlined, ClearOutlined, PlusOutlined, MinusOutlined, SearchOutlined } from '@ant-design/icons';
// import './stylemodal.css'
import FormItem from 'antd/es/form/FormItem';


//setup state for modalshow
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modalshow: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  //modal
  const handleOk = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // select part no. for record
  const [partnumber, setNamePart] = useState("");
  useEffect(() => {
    if (isOpen) {
      setNamePart("");
    } else {}
  }, [onClose]);

  // save item.name in itemName
  const handleColor = (itemName: any) => {
    setNamePart(itemName);
  };

  //switch display
  const [visible, setVisible] = useState(true);
  const displayChange = () => {
    setVisible(!visible);
  };

  //numpad  
  const [count, setCount] = useState(1);
    useEffect(() => {
      if (isOpen) {
        setCount(1);
      } else {}
    }, [onClose]);

    const plus = () => {
        setCount(count + 1)
      };

    const minus = () => {
        let
          newCount = count - 1;
        if (newCount < 0) {
          return {newCount: 0}
        } else {
        setCount(newCount);
      }};
    
    const handleClick = (button: any) => {
        setCount((prevCount) => parseInt(`${prevCount}${button.value}`));
      };

    const handleClear  = () => {
        setCount(0);
      };

    const handleDelete = () => {
        setCount((prevCount: any) => {
          const countString = prevCount.toString();
            if (countString.length > 1) {
              return countString.slice(0, -1);
            } else {
              return 0;
            }
        });
      };

    //TODO: f.get part number show on modal
    const testshow = [
      {name:"TG111"},
      {name:"TG222"},
      {name:"TG333"},
      {name:"TG444"},
      {name:"TG555"}
    ];
      
  return (
    
    <Modal
      className='modal'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1500}
      
    >
      <span style={{fontSize:'30px',display:'flex', justifyContent:'left'}}>Record</span>

      {/* search part no. */}
      <div>
        <div className="searchbox" style={{padding:"5px", display:"flex"}}>
          <div className='search'>
            <Form>
              <FormItem className="searchpart" label={<span className="line id" style={{ fontSize: 25 ,justifyContent:'left'}}> Part Number </span>}>
                <Input style={{width:'300px'}} placeholder="Search Part Number"></Input>
                <Button  
                  type="primary" 
                  icon={<SearchOutlined />} 
                  style={{marginLeft:'5px'}}
                  // onClick={() => handleSearch()}
                  >
                </Button>
              </FormItem>
            </Form>
          </div>

          {/* switch show numpad */}
          <div className='displaybox' style={{display: 'flex', justifyContent: 'flex-end', marginLeft:'auto'}}>
            <Switch
              className='display'
              defaultChecked 
              onChange={displayChange} 
              size="default"
              style={{width:"10px"}}
            />
          </div>
        </div>
      </div>

      {/* box show part no. */}
      <div className='boxpart' style={{display:"flex", msFlexDirection:"row"}}>
        <div className='showpart' style={{border:"1px solid black", flex: visible ? "0 0 70%" : "0 0 100%", height:"300px"}}>
        <Flex wrap="wrap" gap="small">
          <Row gutter={[5,5]} >
            { testshow.map((item) => (
              <Col key={item.name} className="gutter-row" onClick={() => console.log(item.name)}>
                <div 
                  style={{cursor: 'default', padding: '8px', margin:'8px', textAlign:'center', width: "200px", backgroundColor: partnumber === item.name ? 'red' : '#0092ff', }} 
                  onClick={() => handleColor(item.name)}>
                    {item.name}
                </div>
              </Col>
            ))}
          </Row>
        </Flex>
        </div>

        <div className='numpad' style={{ display: visible ? 'block' : 'none', flex: "0 0 30%" , flexDirection:"column", height:"300px"}}>
          <div className="row">
            <button type='button' onClick={() => handleClick({ value: 1 })}>1</button>
            <button type='button' onClick={() => handleClick({ value: 2 })}>2</button>
            <button type='button' onClick={() => handleClick({ value: 3})}>3</button>
          </div>
          <div className="row">
            <button type='button' onClick={() => handleClick({ value: 4 })}>4</button>
            <button type='button' onClick={() => handleClick({ value: 5 })}>5</button>
            <button type='button' onClick={() => handleClick({ value: 6 })}>6</button>
          </div>
          <div className="row">
            <button type='button' onClick={() => handleClick({ value: 7 })}>7</button>
            <button type='button' onClick={() => handleClick({ value: 8 })}>8</button>
            <button type='button' onClick={() => handleClick({ value: 9 })}>9</button>
          </div>
          <div className="row">
            <button type='button' onClick={(handleClear)} title='Clear'><ClearOutlined /></button>
            <button type='button' onClick={() => handleClick({ value: 0 })}>0</button>
            <button type='button' onClick={(handleDelete)} title="Delete"><CloseSquareOutlined /></button>
          </div>
        </div>
      </div>
     
      {/* record data */}
      <div className='boxrecord'>
        <div className='record' style={{height:"60px", paddingTop:"10px", marginLeft:"250px"}}>
          <Space direction="horizontal">
            <Input className="record_amount" addonBefore="Amount:" suffix="PC(s)" value={count} /> 
              <Button 
                className='plus' 
                type="primary" 
                onClick={plus} 
                style={{paddingLeft:"10px", height:'70px'}} >
                  <PlusOutlined/>
              </Button>
              <Button 
                className='minus' 
                type="primary" 
                onClick={minus}
                style={{height:'70px'}}>
                  <MinusOutlined />
              </Button>
          </Space>
        </div>

        {/* Button save or close modal */}
        <div className='finalrecord'>
          <Button 
            className='save' 
            type="primary" 
            onClick={handleCancel} 
            style={{margin:"5px", marginLeft:"900px"}}>
              Save
          </Button>
          <Button 
            className='close' 
            type="primary" 
            onClick={handleCancel}>
              Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Modalshow;