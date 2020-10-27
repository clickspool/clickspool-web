import { formatMessage } from 'umi/locale';

export const message_type_enum={
  text:0,
  img:1,
  video:2,
  audio:3
}
export const send_platform_enum={
  0:formatMessage({id:'operation.messagepush.unlimitedTerminal'}),
  1:'Android',
  2:'IOS'
}
export const send_user_tag_enum ={
  0:formatMessage({id:'operation.messagepush.unlimitedSex'}),
  1:formatMessage({id:'operation.messagepush.male'}),
  2:formatMessage({id:'operation.messagepush.female'})
}
export const send_type_enum={
  0:formatMessage({id:'operation.messagepush.noSend'}),
  1:formatMessage({id:'operation.messagepush.firstLoginSend'}),
  2:formatMessage({id:'operation.messagepush.onceLoginSend'}),
  3:formatMessage({id:'operation.messagepush.fixTimeSend'})
}

export const send_user_ids_enum={
  0:formatMessage({id:'operation.messagepush.unlimitedUser'}),
  1:formatMessage({id:'operation.messagepush.referUser'})
};
