Step 1: Install Java and SSH
Open the Ubuntu Terminal and run:
sudo apt update
sudo apt install openjdk-11-jdk ssh rsync -y


Check Java:
java -version

dirname $(dirname $(readlink -f $(which java)))

Check the Java compiler:
javac -version

1. Update Packages & Install OpenSSH
sudo apt update
sudo apt install openssh-server -y

2. Manage the SSH Service
sudo systemctl enable --now ssh.socket
To check if the service is configured correctly and listening, run:
bash
# For Ubuntu 24.04+
sudo systemctl status ssh.socket

# For Ubuntu 22.04 and older
sudo systemctl status ssh

Step 2: Download and install Hadoop
Download Hadoop 3.4.1 and extract it:
cd ~
wget https://downloads.apache.org/hadoop/common/hadoop-3.4.1/hadoop-3.4.1.tar.gz
tar -xzf hadoop-3.4.1.tar.gz
mv hadoop-3.4.1 hadoop


Set the Hadoop environment variables:
nano ~/.bashrc


Go to the bottom and add these lines:
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export HADOOP_HOME=$HOME/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin


Save using Ctrl+O, press Enter, and exit with Ctrl+X.

Apply the settings:
source ~/.bashrc


Check Hadoop:
hadoop version


Step 3: Configure SSH
Hadoop needs SSH to start its services.
sudo systemctl enable --now ssh
ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
ssh localhost


If asked to continue connecting, type yes. Then exit the SSH session:
exit


Step 4: Configure Hadoop
First, set Java inside Hadoop's configuration:
nano ~/hadoop/etc/hadoop/hadoop-env.sh


Add or update this line:
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64


Now configure the four files below. Copy and run each command separately.

1. Configure core-site.xml
cat > ~/hadoop/etc/hadoop/core-site.xml <<'EOF'
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>
EOF


2. Configure hdfs-site.xml
cat > ~/hadoop/etc/hadoop/hdfs-site.xml <<'EOF'
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:///home/USER/hadoopdata/namenode</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:///home/USER/hadoopdata/datanode</value>
    </property>
</configuration>
EOF


Important: Replace USER in both paths with your Ubuntu username. For example, if your username is student, use /home/student/hadoopdata/namenode.

3. Configure mapred-site.xml
cat > ~/hadoop/etc/hadoop/mapred-site.xml <<'EOF'
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
EOF


4. Configure yarn-site.xml
cat > ~/hadoop/etc/hadoop/yarn-site.xml <<'EOF'
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>
EOF


Create the storage directories:
mkdir -p ~/hadoopdata/namenode ~/hadoopdata/datanode


Step 5: Start Hadoop
Format the NameNode. Do this only when initializing a fresh Hadoop installation.
hdfs namenode -format


Start HDFS:
start-dfs.sh


Start YARN:
start-yarn.sh


Check the running processes:
jps


You should see processes such as NameNode, DataNode, SecondaryNameNode, ResourceManager, and NodeManager.
Step 6: Create the Word Count program
Create a working folder:
mkdir -p ~/wordcount
cd ~/wordcount


Create the Java file:
nano WordCount.java


Copy this simple Word Count program into it.

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class WordCount {

    public static class Map
        extends Mapper<Object, Text, Text, IntWritable> {

        public void map(Object key, Text value, Context context)
            throws IOException, InterruptedException {

            StringTokenizer words =
                new StringTokenizer(value.toString());

            while (words.hasMoreTokens()) {
                context.write(
                    new Text(words.nextToken()),
                    new IntWritable(1)
                );
            }
        }
    }

    public static class Reduce
        extends Reducer<Text, IntWritable, Text, IntWritable> {

        public void reduce(Text word, Iterable<IntWritable> values,
            Context context)
            throws IOException, InterruptedException {

            int sum = 0;

            for (IntWritable value : values) {
                sum += value.get();
            }

            context.write(word, new IntWritable(sum));
        }
    }

    public static void main(String[] args) throws Exception {

        Job job = Job.getInstance(new Configuration(), "Word Count");

        job.setJarByClass(WordCount.class);
        job.setMapperClass(Map.class);
        job.setReducerClass(Reduce.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}



Save with Ctrl+O, Enter, then Ctrl+X.
Step 7: Create the input text file
Run:
cd ~/wordcount
echo "hello world hello hadoop" > input.txt


Upload the file to HDFS:
hdfs dfs -mkdir -p /input
hdfs dfs -put input.txt /input/


Step 8: Compile the program and create a JAR
Run these commands from ~/wordcount:
javac -classpath "$(hadoop classpath)" WordCount.java


Create the JAR file:
jar -cvf wordcount.jar WordCount*.class 'WordCount$Map.class' 'WordCount$Reduce.class'


The command above can include duplicate class entries because WordCount*.class already matches the mapper and reducer classes. A cleaner, recommended command is:
jar -cvf wordcount.jar WordCount.class 'WordCount$Map.class' 'WordCount$Reduce.class'


Use the cleaner command if you haven't already created the JAR.
Step 9: Execute the Word Count program
Run the MapReduce job:
hadoop jar wordcount.jar WordCount /input /output


Wait until the job completes successfully.

Display the result:
hdfs dfs -cat /output/part-r-00000


Expected output:
hadoop  1
hello   2
world   1


Result

The Hadoop Word Count program executes successfully on a single-node Ubuntu cluster and counts the occurrences of each word using MapReduce.
Note: If you run the program again, delete the previous output directory first, because Hadoop will not overwrite an existing output directory:
hdfs dfs -rm -r /output


You can also view the Hadoop web interfaces in your Ubuntu browser:
- NameNode: http://localhost:9870
- ResourceManager: http://localhost:8088