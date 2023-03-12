Here is the instructions and the code snippets used to set up a REST API that accepts both HTTP and HTTPS requests to a SageMaker endpoint (as of now, 12 March 2023). The tech stack used is AWS-only. The general idea was explained in the blog [post](https://aws.amazon.com/blogs/machine-learning/call-an-amazon-sagemaker-model-endpoint-using-amazon-api-gateway-and-aws-lambda/).

## 1. Set up SageMaker endpoint:

It is great that HuggingFace is integrated within SageMaker as it is much easier to train or deploy an endpoint. For training, check out this [example](https://huggingface.co/docs/sagemaker/train). The code snippet is only for deployment, and can be paired with this [example](https://huggingface.co/docs/sagemaker/inference).

After following the notebook, and endpoint was created at `huggingface-pytorch-inference-2023-03-11-13-14-20-423`. The greatest thing would be to be able to use this endpoint as an API already (just like HuggingFace Hub). But that's not how we do it with AWS.

## 2. Set up a Lambda function to call the endpoint:

Add the endpoint to an environment variable. The invocation logic is the same as with any case from `boto3` - create a `client`, this time for `sagemaker-runtime` (`runtime.sagemaker` still seems to work). And then receive `response` with
```python
response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                       Body=bytes(messageStr, 'utf-8'),
                                       ContentType='application/json')
```
There are 2 compulsory arguments to pass. `ContentType` specifies the type of content to pass to the model. **For all HuggingFace model, the input is a json file, as specified [here](https://huggingface.co/docs/api-inference/detailed_parameters)**. The second is `Body`, which needs to be "bytes or seekable file-like object", according to the [docs](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sagemaker-runtime/client/invoke_endpoint.html). The most peculiar thing is the json file sent will automatically has all its double-quotes replaced with single quotes, while the model expects all double quotes (correct json format). That's where the `.replace()` method came in.

## 3. Set up a REST API with API Gateway and CloudFront.

The next part of the tutorial was correct. Just follow through. When testing with Postman API, it worked.

![](/../../Diagram/postman_1.png)

Okay, but it turned out that API Gateway only handled HTTPS request, while our backend requests is HTTP. The easiest way is to set up a CloudFront distribution, as described [here](https://stackoverflow.com/questions/43236152/how-to-make-aws-api-gateway-accept-http-instead-of-https/44901263) (follow the Smartcam project mentioned). Another way is to use [Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) by setting up a web app just for this purpose.

After configuring a CloudFront distribution, it worked.

![](/../../Diagram/postman_2.png)

Afterwards, team web app integrated the API to the backend and it worked.