# 原版 windowBridge WebRTC/信令协议提取

原文件已原样存档: protocol/windowBridge-original.html（164705 字节）

- `RTCPeerConnection` → ['RTCPeerConnection']
- `/signaling/[a-z]+` → ['/signaling/answer', '/signaling/ice', '/signaling/offer']
- `createOffer|createAnswer|addIceCandidate` → ['addIceCandidate', 'createAnswer']
- `getUserMedia` → []
- `addTrack|addTransceiver` → ['addTrack']
- `DataChannel|datachannel` → ['DataChannel', 'datachannel']
- `stun:|turn:` → ['turn:']

## offer 请求上下文
```js
lePopupPayloadChunk(msg);           else if (msg.type === 'popup_payload_end') handlePopupPayloadEnd(msg);           else handleServerDcMessage(msg);         } catch (e) {           log('DC onmessage error: ' + e.message + ' data=' + String(msgEvt.data).substring(0, 200), 'err');         }       };     };      // Step 1: Request the server-generated offer.     const serverOffer = await fetchJson('/signaling/offer', {       method: 'POST',       headers: {'Content-Type': 'application/json'},       body: JSON.stringify({})     });      if (!serverOffer || !serverOffer.sdp) {       log('WebRTC signaling: no server offer: ' + JSON.stringify(serverOffer), 'err');       throw new Error('Signaling failed: no server offer (backend may be unreachable)');     }      log('Server offer received (' + serverOffer.sdp.length + ' bytes)', 'info');      // Step 2: Set server offer as remote description. 
```