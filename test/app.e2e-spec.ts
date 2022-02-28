import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const createdBody = { greeting: 'Hey', name: 'Dan' };
const notFoundBody = { greeting: 'Hey', name: 'Not Dan' };
// This body is applicable to two errors:
// - A not found error as it has the name Not Dan
// - A bad request error as it is missing the property greeting
// I would expect a bad request error as I expected validation
// to take a higher (or equal) priority to customer parameter
// decorators.
const badRequestBody = { name: 'Not Dan' };

const { BAD_REQUEST, CREATED, NOT_FOUND } = StatusCodes;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('When a POST request is made to /greetings', () => {
    describe(`And the request body is ${JSON.stringify(createdBody)}`, () => {
      it(`Then it should respond with an HTTP ${CREATED} and a greeting.`, () => {
        return request(app.getHttpServer())
          .post('/greetings')
          .expect(CREATED)
          .expect(
            `${createdBody.greeting} ${createdBody.name}, how are you today?`,
          )
          .send(createdBody);
      });
    });

    describe(`And the request body is ${JSON.stringify(notFoundBody)}`, () => {
      it(`Then it should respond with an HTTP ${NOT_FOUND} and a greeting.`, () => {
        return request(app.getHttpServer())
          .post('/greetings')
          .expect(NOT_FOUND)
          .expect({
            statusCode: NOT_FOUND,
            message: `The name ${notFoundBody.name} could not be found. Are you sure this person is real?`,
            error: getReasonPhrase(NOT_FOUND),
          })
          .send(notFoundBody);
      });
    });

    describe(`And the request body is ${JSON.stringify(
      badRequestBody,
    )}`, () => {
      it(`Then it should respond with an HTTP ${BAD_REQUEST} and a greeting.`, () => {
        return request(app.getHttpServer())
          .post('/greetings')
          .expect(BAD_REQUEST)
          .send(badRequestBody);
      });
    });
  });
});
