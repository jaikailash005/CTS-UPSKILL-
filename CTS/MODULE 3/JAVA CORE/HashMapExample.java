import java.util.HashMap;

public class HashMapExample {
    public static void main(String[] args) {

        HashMap<Integer,String> map = new HashMap<>();

        map.put(101,"John");
        map.put(102,"David");

        System.out.println(map.get(101));
    }
}