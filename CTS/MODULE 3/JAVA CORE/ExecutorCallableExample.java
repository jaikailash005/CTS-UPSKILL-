import java.util.concurrent.*;

public class ExecutorCallableExample {

    public static void main(String[] args)
            throws Exception {

        ExecutorService service =
                Executors.newFixedThreadPool(3);

        Callable<Integer> task =
                () -> 10 + 20;

        Future<Integer> result =
                service.submit(task);

        System.out.println(
                "Result = " + result.get());

        service.shutdown();
    }
}