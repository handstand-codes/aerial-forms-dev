import React from 'react';
import {
  FormLayout,
  TextField,
  Button,
  Stack,
  Form,
} from "@shopify/polaris";
import { useCallback } from "react";
import { useState } from "react";



export function EmailForm({ onSave }) {
  

  const [email, setEmail] = useState("");
  
  
  const updateEmailName = useCallback(
    (emailName: string) => 
    {
      console.log(emailName)
      
      setEmail(emailName)
    },
    [],
  );
  
  const saveEmail = () => {
    onSave(
      email
    );
  };


  return (
    <Form onSubmit={saveEmail}>
      <FormLayout>
      
        <TextField
          label="Email"
          type="email"
          name="contact[email]"
          value={email}
          autoComplete="off"
          onChange={updateEmailName}
          placeholder="Enter customer email"
          
        />

        <Stack>
          <Button primary submit>
            Save email
          </Button>
        </Stack>
       
      </FormLayout>
    </Form>
  );
}


