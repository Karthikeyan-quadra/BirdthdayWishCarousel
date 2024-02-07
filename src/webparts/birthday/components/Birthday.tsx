import * as React from 'react';
import { Carousel, Card } from 'antd';
import { IBirthdayProps } from './IBirthdayProps';
import 'antd/dist/reset.css';
import { useEffect, useState } from "react";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { MSGraphClientV3 } from '@microsoft/sp-http';
const contentStyle: React.CSSProperties = {
  height: '160px',
  color: 'black',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
  justifyContent:'center'
};


var customStyles = `
:where(.css-dev-only-do-not-override-1rqnfsa).ant-carousel .slick-dots li button {
  background-color: black !important;
  color: black !important
}
`;

interface BirthdayUser extends MicrosoftGraph.User {
  employeeHireDate: string; // Assuming it's a string, you may need to adjust the type
}

const Birthday = (props: IBirthdayProps) => {
  const [birthdays, setBirthdays] = useState<BirthdayUser[]>([]);

  useEffect(() => {
    props.context.msGraphClientFactory
      .getClient("3")
      .then((client: MSGraphClientV3) => {
        client
          .api('/users')
          .version("v1.0")
          .select("displayName,employeeHireDate,jobTitle,userPrincipalName")
          .get((error: any, eventsResponse, rawResponse?: any) => {
            if (error) {
              console.error("Message is: " + error);
              return;
            }

            const birthdayUsers: BirthdayUser[] = eventsResponse.value;
            setBirthdays(birthdayUsers);
          });
      });
  }, [props.context.msGraphClientFactory]);

  console.log(birthdays);

  // Filter birthdays for today
  const today = new Date();
  const todayBirthdays = birthdays.filter((user: BirthdayUser) => {
    const hireDate = new Date(user.employeeHireDate);
    return (
      hireDate.getMonth() === today.getMonth() &&
      hireDate.getDate() === today.getDate()
    );
  });

  return (
    <>
    <style>{customStyles}</style>
    <Carousel autoplay >
      {todayBirthdays.map((user: BirthdayUser) => (
        <div key={user.id} style={contentStyle}>
          <Card style={{ width: 300, margin: 'auto', boxShadow: '0 6px 8px rgba(0, 0, 0, 0.1)' }}>
          <img src={require('../assets/wish.svg')} alt="Happy birthday" style={{margin:"auto"}}/>
          <img src={`/_layouts/15/userphoto.aspx?size=L&username=${user.userPrincipalName}`} alt={`${user.displayName}`}  style={{width:'-webkit-fill-available', height:'250px', border:'5px solid #283657', borderRadius:'50%', padding:"5px"}}/>
          <h3 style={{textAlign:'center', fontSize:'25px', fontWeight:'600', color:'#366397'}}>{user.displayName}</h3>
          <h4 style={{textAlign:'center', fontSize:'15px', fontWeight:'350', color:'#595959'}}>{user.jobTitle}</h4>

          </Card>
        </div>
      ))}
    </Carousel>
    </>
  );
};

export default Birthday;
