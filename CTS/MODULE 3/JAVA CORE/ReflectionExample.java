import java.lang.reflect.*;

class Test {

    public void show() {
        System.out.println("Reflection");
    }
}

public class ReflectionExample {

    public static void main(String[] args)
            throws Exception {

        Class<?> c =
                Class.forName("Test");

        Object obj =
                c.getDeclaredConstructor()
                        .newInstance();

        Method m =
                c.getDeclaredMethod("show");

        m.invoke(obj);
    }
}