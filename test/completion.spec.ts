import axios from 'axios';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Completion } from '../src';

describe('Completion', function() {
  let sandbox: sinon.SinonSandbox;
  let axiosStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    axiosStub = sandbox.stub(axios, 'post');
    consoleErrorStub = sandbox.stub(console, 'error');
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('constructor', function() {
    it('should use provided API key and URL', function() {
      const completion = new Completion({
        apiKey: 'test_api_key',
        apiUrl: 'http://testurl.com',
      });
      expect(completion.apiKey).to.equal('test_api_key');
      expect(completion.apiUrl).to.equal('http://testurl.com');
    });

    it('should throw if API key is missing', function() {
      const constructor = () => new Completion();
      expect(constructor).to.throw('API key is missing');
    });
  });

  describe('log', function() {
    it('should throw an error if template name is missing', async function() {
      const completion = new Completion({ apiKey: 'test_api_key' });
      try {
        // @ts-ignore
        await completion.log({});
        expect.fail('Should have thrown an error');
      } catch (error) {
        // @ts-ignore
        expect(error.message).to.equal('Template name is required.');
      }
    });

    it('should log completion successfully', async function() {
      const completion = new Completion({
        apiKey: 'test_api_key',
        apiUrl: 'http://testurl.com',
      });
      const logOptions = {
        templateName: 'testTemplate',
        promptTemplate: 'Hello, {{name}}',
        promptArguments: { name: 'world' },
        output: 'Hello, world!',
        parser: 'handlebars',
        model: 'test_model',
      };

      axiosStub.resolves({ data: 'Success' });

      await completion.log(logOptions);

      sinon.assert.calledWithExactly(
        axiosStub,
        'http://testurl.com',
        sinon.match.has('prompt_template', 'Hello, {{name}}'),
        sinon.match.has(
          'headers',
          sinon.match.has('Authorization', 'Bearer test_api_key'),
        ),
      );
      expect(consoleErrorStub.called).to.be.false;
    });

    it('should log an error message when the API request fails', async function() {
      const completion = new Completion({
        apiKey: 'test_api_key',
        apiUrl: 'http://testurl.com',
      });
      const logOptions = {
        templateName: 'testTemplate',
        promptTemplate: 'Hello, {{name}}',
        promptArguments: { name: 'world' },
        output: 'Hello, world!',
        parser: 'handlebars',
        model: 'test_model',
      };

      axiosStub.rejects(new Error('Network Error'));

      await completion.log(logOptions);
      sinon.assert.calledOnce(consoleErrorStub);
      sinon.assert.calledWithExactly(
        consoleErrorStub,
        'Error logging completion:',
        sinon.match.instanceOf(Error),
      );
    });
  });
});
