import {Injectable} from '@angular/core';
import { init as initApm } from '@elastic/apm-rum'

@Injectable()
export class ApmService {
    
    private apm = initApm({
        serviceName: 'apm-test',
        serverUrl: 'http://localhost:8200'
    });

    captureTransaction(name: string) {
        var transaction = this.apm.startTransaction(name, 'request');
        var span = transaction.startSpan(name);
        span.end();
        transaction.end();
    }

    captureSpan(transaction: any, name: string) {
        if (transaction != undefined) {
            var span = transaction.startSpan(name);
            span.end();
        }
    }

    endTransaction(transaction: any) {
        if (transaction != undefined) {
            transaction.end();
        }
    }
}