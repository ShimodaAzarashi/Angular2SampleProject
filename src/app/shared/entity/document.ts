/**
 * Created by saburoshiota on 2016/12/03.
 */

export class Document {

  _id: string;
  encryptId: string;
  question: string;
  answer: string;
  posted: string;
  last_update: string;
  like: number;
  _score: number;

  user_session: string;
  user_question: string;
  base_id: string;

  check: string;
}
