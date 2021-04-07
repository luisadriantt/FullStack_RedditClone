import { Button } from "@chakra-ui/button";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";

const ForgoPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPasword] = useForgotPasswordMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPasword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Alert status="success">
              <AlertIcon />
              <AlertDescription>
                If the email exist, we'll sent you an email
              </AlertDescription>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => router.push("/")}
              />
            </Alert>
          ) : (
            <Form>
              <InputField
                name="email"
                label="email"
                placeholder="email"
                type="email"
              />
              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                color="green.500"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgoPassword);
