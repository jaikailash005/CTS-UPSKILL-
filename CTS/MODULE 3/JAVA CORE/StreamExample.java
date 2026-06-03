import java.util.*;
import java.util.stream.*;

public class StreamExample {
    public static void main(String[] args) {

        List<Integer> nums =
                Arrays.asList(1,2,3,4,5,6,7,8);

        List<Integer> even =
                nums.stream()
                        .filter(n -> n % 2 == 0)
                        .collect(Collectors.toList());

        System.out.println(even);
    }
}